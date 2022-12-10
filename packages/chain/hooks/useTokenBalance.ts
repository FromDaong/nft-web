import {useCallback, useEffect, useState} from "react";

import BigNumber from "bignumber.js";
import useBlock from "./useBlock";
import {getBalance} from "@utils/erc20";
import {useAccount} from "wagmi";
import web3 from "@utils/web3";

const useTokenBalance = (tokenAddress: string) => {
	const [balance, setBalance] = useState(new BigNumber(0));
	const {address: account} = useAccount();
	const block = useBlock();

	const fetchBalance = useCallback(async () => {
		const balance = await getBalance(
			web3.currentProvider as any,
			tokenAddress,
			account
		);
		setBalance(new BigNumber(balance));
	}, [account, tokenAddress]);

	useEffect(() => {
		if (account) {
			fetchBalance();
		}
	}, [account, setBalance, block, tokenAddress]);

	return balance;
};

export default useTokenBalance;
