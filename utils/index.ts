import BigNumber from "bignumber.js";
import {MathUtil} from "./math";
import {ReactUtil} from "./react";

export {default as formatAddress} from "./formatAddress";

export const bnToDec = (bn: BigNumber, decimals = 18): number => {
	return bn.dividedBy(new BigNumber(10).pow(decimals)).toNumber();
};

export const decToBn = (dec: number, decimals = 18) => {
	return new BigNumber(dec).multipliedBy(new BigNumber(10).pow(decimals));
};

export const apiEndpoint = "/api/v3";

export {MathUtil, ReactUtil};
