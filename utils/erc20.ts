/* eslint-disable @typescript-eslint/no-unused-vars */
import { provider } from "web3-core";
import { Contract } from "web3-eth-contract";

export const getAllowance = async (
  lpContract: Contract,
  smoltingPotContract: Contract,
  account: string
): Promise<string> => {
  try {
    const allowance: string = await lpContract.methods
      .allowance(account, smoltingPotContract.options.address)
      .call();
    return allowance;
  } catch (e) {
    return "0";
  }
};

export const getBalance = async (
  _provider: provider,
  _tokenAddress: string,
  _userAddress: string
): Promise<string> => {
  /*const lpContract = getContract(provider, tokenAddress);
  try {
    const balance: string = await lpContract.methods
      .balanceOf(userAddress)
      .call();

    return balance;
  } catch (e) {
    console.error({ e });
    return "0";
  }*/
  return "0.00";
};
