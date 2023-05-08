import {Contracts} from "./lib/contracts";
import Web3 from "web3";
import {contractAddresses} from "./lib/treat-contracts-constants";

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
		this.privateKey = this.treatAddress =
			contractAddresses.treatV1Token[networkId];
		this.wethAddress = contractAddresses.weth[networkId];
		this.treatNFTMinterAddress = contractAddresses.treatNFTMinter[networkId];
	}
}
