import BigNumber from "bignumber.js";
import { MathUtil } from "./math";
import { ReactUtil } from "./react";

export { default as formatAddress } from "./formatAddress";

export const bnToDec = (bn: BigNumber, decimals = 18): number => {
  return bn.dividedBy(BigNumber.from(10).pow(decimals)).toNumber();
};

export const decToBn = (dec: number, decimals = 18) => {
  return BigNumber.from(dec).multipliedBy(BigNumber.from(10).pow(decimals));
};

export { MathUtil, ReactUtil };
