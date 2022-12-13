import {BigNumber} from "ethers";

export const getBalanceNumber = (balance: BigNumber, decimals = 18) => {
	const displayBalance = balance.div(BigNumber.from(10).pow(decimals));
	return displayBalance.toNumber();
};

export const getDisplayBalance = (balance: BigNumber, decimals = 18) => {
	const displayBalance = balance.div(BigNumber.from(10).pow(decimals));
	if (displayBalance.lt(1)) {
		return displayBalance.toNumber().toPrecision(4);
	} else {
		return displayBalance
			.toNumber()
			.toFixed(2)
			.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}
};

export const getFullDisplayBalance = (balance: BigNumber, decimals = 18) => {
	return balance.div(BigNumber.from(10).pow(decimals)).toNumber().toFixed(2);
};
