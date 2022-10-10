import * as Types from "./types";

import { SUBTRACT_GAS_LIMIT, contractAddresses } from "./constants";

import BigNumber from "bignumber.js/bignumber";
import CreatorMartAbi from "./abi/creatormart.json";
import GenericBep20 from "./abi/erc20.json";
import MasterMelonFarmerAbi from "./abi/mastermelonfarmer.json";
import MelonAbi from "./abi/melontoken.json";
import MelonMartAbi from "./abi/melonmart.json";
import MinterPermissionHelperAbi from "./abi/nftminterpermissionhelper.json";
import PancakeLPAbi from "./abi/treatpancakelp.json";
import SubscriberMartAbi from "./abi/subscribermart.json";
import TippingContractAbi from "./abi/tippingcontract.json";
import TotwMinterHelperAbi from "./abi/totwminterhelper.json";
import Treat2Abi from "./abi/treat2.json";
import TreatAbi from "./abi/treat.json";
import TreatMarketReaderAbi from "./abi/treatmarketreader.json";
import TreatMarketplaceAbi from "./abi/treatMarketplace.json";
import TreatMartAbi from "./abi/treatmart.json";
import TreatNFTMinterAbi from "./abi/treatnftminter.json";
import TreatNFTMinterV1Abi from "./abi/treatnftminterv1.json";
import TreatSubscriptionsAbi from "./abi/treatsubscriptions.json";
import TreatTradeInAbi from "./abi/treattradein.json";
import TreatV1ForV2Abi from "./abi/treatv1forv2.json";
import WETHAbi from "./abi/weth.json";
import { Treat } from "..";

export class Contracts implements Types.IContracts {
  web3: any;
  defaultConfirmations: any;
  autoGasMultiplier: any;
  confirmationType: any;
  defaultGas: any;
  defaultGasPrice: any;
  treat: Treat;
  treatNFTMinter: any;
  treatNFTMinterV1: any;
  treatMart: any;
  creatorMart: any;
  subscriberMart: any;
  melonMart: any;
  totwMinterHelper: any;
  treatMarketplace: any;
  treatMarketReader: any;
  treatSubscriptions: any;
  tippingContract: any;
  weth: any;
  treatTradeIn: any;
  treatV1ForV2: any;
  treat2: any;
  melon: any;
  masterMelonFarmer: any;
  v1MasterMelonFarmer: any;
  treatPancakeLP: any;
  minterPermissionHelper: any;
  busdToken: any;
  usdcToken: any;
  blockGasLimit: any;
  notifier: any;

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
    this.treatNFTMinterV1 = new this.web3.eth.Contract(TreatNFTMinterV1Abi);
    this.treatMart = new this.web3.eth.Contract(TreatMartAbi);
    this.creatorMart = new this.web3.eth.Contract(CreatorMartAbi);
    this.subscriberMart = new this.web3.eth.Contract(SubscriberMartAbi);
    this.melonMart = new this.web3.eth.Contract(MelonMartAbi);
    this.totwMinterHelper = new this.web3.eth.Contract(TotwMinterHelperAbi);
    this.treatMarketplace = new this.web3.eth.Contract(TreatMarketplaceAbi);
    this.treatMarketReader = new this.web3.eth.Contract(TreatMarketReaderAbi);
    this.treatSubscriptions = new this.web3.eth.Contract(TreatSubscriptionsAbi);
    this.tippingContract = new this.web3.eth.Contract(TippingContractAbi);
    this.weth = new this.web3.eth.Contract(WETHAbi);
    this.treatTradeIn = new this.web3.eth.Contract(TreatTradeInAbi);
    this.treatV1ForV2 = new this.web3.eth.Contract(TreatV1ForV2Abi);
    this.treat2 = new this.web3.eth.Contract(Treat2Abi);
    this.melon = new this.web3.eth.Contract(MelonAbi);
    this.masterMelonFarmer = new this.web3.eth.Contract(MasterMelonFarmerAbi);
    this.v1MasterMelonFarmer = new this.web3.eth.Contract(MasterMelonFarmerAbi);
    this.treatPancakeLP = new this.web3.eth.Contract(PancakeLPAbi);
    this.minterPermissionHelper = new this.web3.eth.Contract(
      MinterPermissionHelperAbi
    );

    // add generic BEP20 payments
    this.busdToken = new this.web3.eth.Contract(GenericBep20);
    this.usdcToken = new this.web3.eth.Contract(GenericBep20);

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
    setProvider(
      this.treatNFTMinterV1,
      contractAddresses.treatNFTMinterV1[networkId]
    );

    setProvider(this.treatMart, contractAddresses.treatMart[networkId]);
    setProvider(
      this.totwMinterHelper,
      contractAddresses.totwMinterHelper[networkId]
    );
    setProvider(
      this.treatMarketplace,
      contractAddresses.treatMarketplace[networkId]
    );
    setProvider(
      this.treatMarketReader,
      contractAddresses.treatMarketReader[networkId]
    );
    setProvider(
      this.treatSubscriptions,
      contractAddresses.treatSubscriptions[networkId]
    );
    setProvider(this.treatTradeIn, contractAddresses.treatTradeIn[networkId]);
    setProvider(this.treatV1ForV2, contractAddresses.treatV1ForV2[networkId]);
    setProvider(this.creatorMart, contractAddresses.creatorMart[networkId]);
    setProvider(
      this.subscriberMart,
      contractAddresses.subscriberMart[networkId]
    );
    setProvider(this.melonMart, contractAddresses.melonMart[networkId]);
    setProvider(this.weth, contractAddresses.weth[networkId]);
    setProvider(this.treat2, contractAddresses.treat2[networkId]);
    setProvider(
      this.tippingContract,
      contractAddresses.tippingContract[networkId]
    );
    setProvider(this.melon, contractAddresses.melon[networkId]);
    setProvider(
      this.masterMelonFarmer,
      contractAddresses.masterMelonFarmer[networkId]
    );
    setProvider(
      this.v1MasterMelonFarmer,
      contractAddresses.v1MasterMelonFarmer[networkId]
    );
    setProvider(
      this.treatPancakeLP,
      contractAddresses.treatPancakeLP[networkId]
    );
    setProvider(
      this.minterPermissionHelper,
      contractAddresses.minterPermissionHelper[networkId]
    );
    setProvider(this.busdToken, contractAddresses.busdToken[networkId]);
    setProvider(this.usdcToken, contractAddresses.usdcToken[networkId]);
  }

  setDefaultAccount(account) {
    this.treat.options.from = account;
    this.treatNFTMinter.options.from = account;
    this.treatNFTMinterV1.options.from = account;
    this.treatMart.options.from = account;
    this.creatorMart.options.from = account;
    this.subscriberMart.options.from = account;
    this.melonMart.options.from = account;
    this.totwMinterHelper.options.from = account;
    this.treatMarketplace.options.from = account;
    this.treatMarketReader.options.from = account;
    this.treatSubscriptions.options.from = account;
    this.tippingContract.options.from = true;
    // token support:
    this.busdToken.options.from = account;
    this.usdcToken.options.from = account;
    //
    this.treatTradeIn.options.from = account;
    this.treatV1ForV2.options.from = account;
    this.treat2.options.from = account;
    this.melon.options.from = account;
    this.masterMelonFarmer.options.from = account;
    this.v1MasterMelonFarmer.options.from = account;
    this.treatPancakeLP.options.from = account;
    this.minterPermissionHelper.options.from = account;
  }

  async callContractFunction(method, options) {
    const { confirmations, confirmationType, autoGasMultiplier, ...txOptions } =
      options;

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
        const gas = txOptions.gas;
        return { gasEstimate, g: gas };
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
