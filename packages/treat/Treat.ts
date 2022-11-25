import { Account } from "./lib/accounts";
import { Contracts } from "./lib/contracts";
import Web3 from "web3";
import { contractAddresses } from "./lib/constants";

export class Treat {
  web3: Web3;
  snapshot: any;
  contracts: Contracts;
  privateKey: any;
  treatAddress: any;
  wethAddress: any;
  treatNFTMinterAddress: any;
  accounts: any;
  operation: any;
  options: any;

  constructor(provider, networkId, options) {
    let realProvider;

    if (typeof provider === "string") {
      if (provider.includes("wss")) {
        realProvider = new Web3.providers.WebsocketProvider(
          provider,
          options.ethereumNodeTimeout || 10000
        );
      } else {
        realProvider = new Web3.providers.HttpProvider(
          provider,
          options.ethereumNodeTimeout || 10000
        );
      }
    } else {
      realProvider = provider;
    }

    this.web3 = new Web3(realProvider);

    if (options.defaultAccount) {
      this.web3.eth.defaultAccount = options.defaultAccount;
    }
    this.contracts = new Contracts(realProvider, networkId, this.web3, options);
    this.privateKey = this.treatAddress = contractAddresses.treat[networkId];
    this.wethAddress = contractAddresses.weth[networkId];
    this.treatNFTMinterAddress = contractAddresses.treatNFTMinter[networkId];
  }

  signMessage = async (key, msg) => {
    // TODO: Implement signMessage
    throw Error("NOT Implemented");
  };

  addAccount(address) {
    this.accounts.push(new Account(this.contracts, address));
  }

  setProvider(provider, networkId) {
    this.web3.setProvider(provider);
    this.contracts.setProvider(provider, networkId);
    this.operation.setNetworkId(networkId);
  }

  setDefaultAccount(account) {
    this.web3.eth.defaultAccount = account;
    this.contracts.setDefaultAccount(account);
  }

  getDefaultAccount() {
    return this.web3.eth.defaultAccount;
  }

  loadAccount(account) {
    const newAccount = this.web3.eth.accounts.wallet.add(account.privateKey);

    if (
      !newAccount ||
      (account.address &&
        account.address.toLowerCase() !== newAccount.address.toLowerCase())
    ) {
      throw new Error(`Loaded account address mismatch.
        Expected ${account.address}, got ${
        newAccount ? newAccount.address : null
      }`);
    }
  }
}
