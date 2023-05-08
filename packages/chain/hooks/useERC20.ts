/* eslint-disable no-async-promise-executor */
import {Context} from "@contexts/TreatProvider/TreatProvider";
import {contractAddresses} from "@packages/treat/lib/treat-contracts-constants";
import React, {useContext} from "react";
import {useAccount} from "wagmi";
import Web3 from "web3";

export enum ContractInteractionTypes {
	CALL = "CALL",
	SEND = "SEND",
}

export enum TippingCurrencies {
	BNB = "BNB",
	BUSD = "BUSD",
	USDC = "USDC",
	TREAT = "TREAT",
}

interface ContractCallParameters {
	currency: TippingCurrencies;
	interactionType: ContractInteractionTypes;
}

interface ApprovalReceipt {
	transactionHash: string;
}

export interface IWeb3Context {
	approve: (
		callParameters: ContractCallParameters,
		priceInWei: string
	) => Promise<ApprovalReceipt>;
	allowance: (callParameters: {currency: TippingCurrencies}) => Promise<string>;
	balanceOf: (callParameters: ContractCallParameters) => Promise<string>;
}

const useERC20 = () => {
	const {treat} = useContext(Context);
	const {address: account} = useAccount();
	const web3 = new Web3(
		"https://nd-421-513-967.p2pify.com/4b6934a4a6a6ace1d6ba8644eae82d6e"
	);

	/**
	 * @desc Approves the tipping contract
	 *       to spend on the users behalf
	 */
	const approve: IWeb3Context["approve"] = React.useCallback(
		({currency, interactionType}, priceInWei) => {
			return new Promise(async (resolve, reject) => {
				switch (currency) {
					// TREAT Token
					case TippingCurrencies.TREAT:
						if (treat?.contracts.treat2) {
							if (interactionType === ContractInteractionTypes.CALL)
								treat.contracts.treat2.methods
									.approve(contractAddresses.tippingContract[56], priceInWei)
									.call(
										{from: account},
										(error: string, result: ApprovalReceipt) => {
											if (error) reject(error);
											if (result) resolve(result);
										}
									);
							if (interactionType === ContractInteractionTypes.SEND)
								treat.contracts.treat2.methods
									.approve(contractAddresses.tippingContract[56], priceInWei)
									.send({from: account})
									.then((result: ApprovalReceipt) => resolve(result))
									.catch((error: string) => reject(error));
						} else console.warn("Treat Token Contract not initialized");
						break;
					// BNB
					case TippingCurrencies.BNB:
						if (interactionType === ContractInteractionTypes.CALL)
							resolve({transactionHash: "approved"});

						if (interactionType === ContractInteractionTypes.SEND)
							resolve({transactionHash: "approved"});
						break;
					// BUSD Approval
					case TippingCurrencies.BUSD:
						if (treat?.contracts.busdToken) {
							if (interactionType === ContractInteractionTypes.CALL)
								treat.contracts.busdToken.methods
									.approve(contractAddresses.tippingContract[56], priceInWei)
									.call(
										{from: account},
										(error: string, result: ApprovalReceipt) => {
											if (error) reject(error);
											if (result) resolve(result);
										}
									);
							if (interactionType === ContractInteractionTypes.SEND)
								await treat.contracts.busdToken.methods
									.approve(contractAddresses.tippingContract[56], priceInWei)
									.send({from: account})
									.then((result: ApprovalReceipt) => resolve(result))
									.catch((error: string) => reject(error));
						} else console.warn("BUSD Contract not initialized");
						break;
					case TippingCurrencies.USDC:
						if (treat?.contracts.usdcToken) {
							if (interactionType === ContractInteractionTypes.CALL)
								treat.contracts.usdcToken.methods
									.approve(contractAddresses.tippingContract[56], priceInWei)
									.call(
										{from: account},
										(error: string, result: ApprovalReceipt) => {
											if (error) reject(error);
											if (result) resolve(result);
										}
									);
							if (interactionType === ContractInteractionTypes.SEND)
								await treat.contracts.usdcToken.methods
									.approve(contractAddresses.tippingContract[56], priceInWei)
									.send({from: account})
									.then((result: ApprovalReceipt) => resolve(result))
									.catch((error: string) => reject(error));
						} else console.warn("BUSD Contract not initialized");
						break;
				}
			});
		},
		[account, treat]
	);

	/**
	 * @desc checks to see if the the Tipping contract has permission
	 *       to spend on the users behalf
	 */
	const allowance: IWeb3Context["allowance"] = React.useCallback(
		({currency}) => {
			return new Promise(async (resolve, reject) => {
				switch (currency) {
					case TippingCurrencies.TREAT: {
						if (treat?.contracts.treat2) {
							treat.contracts.treat2.methods
								.allowance(account, contractAddresses.tippingContract[56])
								.call({from: account}, (error: string, result: string) => {
									if (error) reject(error);
									if (result) resolve(result);
								});
						} else console.warn("Treat Token Contract not initialized");
						break;
					}
					case TippingCurrencies.BUSD: {
						if (treat?.contracts.busdToken) {
							treat.contracts.busdToken.methods
								.allowance(account, contractAddresses.tippingContract[56])
								.call({from: account}, (error: string, result: string) => {
									if (error) reject(error);
									if (result) resolve(result);
								});
						} else console.warn("BUSD Token Contract not initialized");
						break;
					}
					case TippingCurrencies.USDC: {
						if (treat?.contracts.usdcToken) {
							treat.contracts.usdcToken.methods
								.allowance(account, contractAddresses.tippingContract[56])
								.call({from: account}, (error: string, result: string) => {
									if (error) reject(error);
									if (result) resolve(result);
								});
						} else console.warn("BUSD Token Contract not initialized");
						break;
					}
				}
			});
		},
		[account, treat]
	);

	/**
	 * @desc gets the current balance of the wallet
	 */
	const balanceOf: IWeb3Context["balanceOf"] = React.useCallback(
		({currency, interactionType}) => {
			return new Promise<string>(async (resolve, reject) => {
				switch (currency) {
					case TippingCurrencies.TREAT: {
						if (treat?.contracts.treat2) {
							if (interactionType === ContractInteractionTypes.CALL)
								treat.contracts.treat2.methods
									.balanceOf(account)
									.call({from: account}, (error: string, result: string) => {
										if (error) reject(error);
										if (result) resolve(result);
									});
						} else console.warn("Treat Token Contract not initialized");
						break;
					}
					case TippingCurrencies.BUSD: {
						if (treat?.contracts.busdToken) {
							if (interactionType === ContractInteractionTypes.CALL)
								treat.contracts.busdToken.methods
									.balanceOf(account)
									.call({from: account}, (error: string, result: string) => {
										if (error) reject(error);
										if (result) resolve(result);
									});
						} else console.warn("BUSD Token Contract not initialized");
						break;
					}
					case TippingCurrencies.USDC: {
						if (treat?.contracts.usdcToken) {
							if (interactionType === ContractInteractionTypes.CALL)
								treat.contracts.usdcToken.methods
									.balanceOf(account)
									.call({from: account}, (error: string, result: string) => {
										if (error) reject(error);
										if (result) resolve(result);
									});
						} else console.warn("BUSD Token Contract not initialized");
						break;
					}
					case TippingCurrencies.BNB: {
						if (interactionType === ContractInteractionTypes.CALL) {
							web3.eth.getBalance(account, (error: any, result: string) => {
								if (error) reject(error);
								if (result) resolve(result);
							});
						}
					}
				}
			});
		},
		[treat, account]
	);

	return {approval: approve, allowance: allowance, balanceOf: balanceOf};
};
export default useERC20;
