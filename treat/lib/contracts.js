import * as Types from "./types.js";

import {
  SUBTRACT_GAS_LIMIT,
  contractAddresses,
} from "./constants.js";

import BigNumber from "bignumber.js/bignumber";
import TreatAbi from "./abi/treat.json";
import TreatMarketplaceAbi from './abi/treatMarketplace.json';
import TreatMartAbi from "./abi/treatmart.json";
import TreatNFTMinterAbi from "./abi/treatnftminter.json";
import WETHAbi from "./abi/weth.json";

export class Contracts {
  constructor(provider, networkId, web3, options) {
    this.web3 = web3;
    this.defaultConfirmations = options.defaultConfirmations;
    this.autoGasMultiplier = options.autoGasMultiplier || 1.5;
    this.confirmationType =
      options.confirmationType || Types.ConfirmationType.Confirmed;
    this.defaultGas = options.defaultGas;
    this.defaultGasPrice = options.defaultGasPrice;

    this.treat = new this.web3.eth.Contract(TreatAbi);
    this.treatNFTMinter = new this.web3.eth.Contract(TreatNFTMinterAbi);
    this.treatMart = new this.web3.eth.Contract(TreatMartAbi);
    this.treatMarketplace = new this.web3.eth.Contract(TreatMarketplaceAbi);
    this.weth = new this.web3.eth.Contract(WETHAbi);

    this.setProvider(provider, networkId);
    this.setDefaultAccount(this.web3.eth.defaultAccount);
  }

  setProvider(provider, networkId) {
    const setProvider = (contract, address) => {
      contract.setProvider(provider);
      if (address) contract.options.address = address;
      else
        console.error(
          "Titty Contract Address not found in network",
          networkId,
          ". Address: ",
          address
        );
    };

    setProvider(this.treat, contractAddresses.treat[networkId]);
    setProvider(
      this.treatNFTMinter,
      contractAddresses.treatNFTMinter[networkId]
    );

    setProvider(this.treatMart, contractAddresses.treatMart[networkId]);
    setProvider(this.treatMarketplace, contractAddresses.treatMarketplace[networkId]);
    setProvider(this.weth, contractAddresses.weth[networkId]);
  }

  setDefaultAccount(account) {
    this.treat.options.from = account;
    this.treatNFTMinter.options.from = account;
    this.treatMart.options.from = account;
    this.treatMarketplace.options.from = account;
  }

  async callContractFunction(method, options) {
    const {
      confirmations,
      confirmationType,
      autoGasMultiplier,
      ...txOptions
    } = options;

    if (!this.blockGasLimit) {
      await this.setGasLimit();
    }

    if (!txOptions.gasPrice && this.defaultGasPrice) {
      txOptions.gasPrice = this.defaultGasPrice;
    }

    if (confirmationType === Types.ConfirmationType.Simulate || !options.gas) {
      let gasEstimate;
      if (
        this.defaultGas &&
        confirmationType !== Types.ConfirmationType.Simulate
      ) {
        txOptions.gas = this.defaultGas;
      } else {
        try {
          console.log("estimating gas");
          gasEstimate = await method.estimateGas(txOptions);
        } catch (error) {
          const data = method.encodeABI();
          const { from, value } = options;
          const to = method._parent._address;
          error.transactionData = { from, value, data, to };
          throw error;
        }

        const multiplier = autoGasMultiplier || this.autoGasMultiplier;
        const totalGas = Math.floor(gasEstimate * multiplier);
        txOptions.gas =
          totalGas < this.blockGasLimit ? totalGas : this.blockGasLimit;
      }

      if (confirmationType === Types.ConfirmationType.Simulate) {
        let g = txOptions.gas;
        return { gasEstimate, g };
      }
    }

    if (txOptions.value) {
      txOptions.value = new BigNumber(txOptions.value).toFixed(0);
    } else {
      txOptions.value = "0";
    }

    const promi = method.send(txOptions);

    const OUTCOMES = {
      INITIAL: 0,
      RESOLVED: 1,
      REJECTED: 2,
    };

    let hashOutcome = OUTCOMES.INITIAL;
    let confirmationOutcome = OUTCOMES.INITIAL;

    const t =
      confirmationType !== undefined ? confirmationType : this.confirmationType;

    if (!Object.values(Types.ConfirmationType).includes(t)) {
      throw new Error(`Invalid confirmation type: ${t}`);
    }

    let hashPromise;
    let confirmationPromise;

    if (
      t === Types.ConfirmationType.Hash ||
      t === Types.ConfirmationType.Both
    ) {
      hashPromise = new Promise((resolve, reject) => {
        promi.on("error", (error) => {
          if (hashOutcome === OUTCOMES.INITIAL) {
            hashOutcome = OUTCOMES.REJECTED;
            reject(error);
            const anyPromi = promi;
            anyPromi.off();
          }
        });

        promi.on("transactionHash", (txHash) => {
          if (hashOutcome === OUTCOMES.INITIAL) {
            hashOutcome = OUTCOMES.RESOLVED;
            resolve(txHash);
            if (t !== Types.ConfirmationType.Both) {
              const anyPromi = promi;
              anyPromi.off();
            }
          }
        });
      });
    }

    if (
      t === Types.ConfirmationType.Confirmed ||
      t === Types.ConfirmationType.Both
    ) {
      confirmationPromise = new Promise((resolve, reject) => {
        promi.on("error", (error) => {
          if (
            (t === Types.ConfirmationType.Confirmed ||
              hashOutcome === OUTCOMES.RESOLVED) &&
            confirmationOutcome === OUTCOMES.INITIAL
          ) {
            confirmationOutcome = OUTCOMES.REJECTED;
            reject(error);
            const anyPromi = promi;
            anyPromi.off();
          }
        });

        const desiredConf = confirmations || this.defaultConfirmations;
        if (desiredConf) {
          promi.on("confirmation", (confNumber, receipt) => {
            if (confNumber >= desiredConf) {
              if (confirmationOutcome === OUTCOMES.INITIAL) {
                confirmationOutcome = OUTCOMES.RESOLVED;
                resolve(receipt);
                const anyPromi = promi;
                anyPromi.off();
              }
            }
          });
        } else {
          promi.on("receipt", (receipt) => {
            confirmationOutcome = OUTCOMES.RESOLVED;
            resolve(receipt);
            const anyPromi = promi;
            anyPromi.off();
          });
        }
      });
    }

    if (t === Types.ConfirmationType.Hash) {
      const transactionHash = await hashPromise;
      if (this.notifier) {
        this.notifier.hash(transactionHash);
      }
      return { transactionHash };
    }

    if (t === Types.ConfirmationType.Confirmed) {
      return confirmationPromise;
    }

    const transactionHash = await hashPromise;
    if (this.notifier) {
      this.notifier.hash(transactionHash);
    }
    return {
      transactionHash,
      confirmation: confirmationPromise,
    };
  }

  async callConstantContractFunction(method, options) {
    const m2 = method;
    const { blockNumber, ...txOptions } = options;
    return m2.call(txOptions, blockNumber);
  }

  async setGasLimit() {
    const block = await this.web3.eth.getBlock("latest");
    this.blockGasLimit = block.gasLimit - SUBTRACT_GAS_LIMIT;
  }
}
