import {
	getTreatMarketplaceAddress,
	getTreatNFTMinterContract,
} from "@packages/chain/utils";
import {useCallback, useEffect, useState} from "react";

import {getIsApprovedForAll} from "../utils/erc1155";
import useBlock from "./useBlock";
import {useAccount} from "wagmi";
import useTreat from "./useTreat";

const useGetMinterIsApprovedForAll = (tokenAddress: string) => {
	const [allowance, setAllowance] = useState(false);
	const {account, provider: ethereum} = useMoralis();
	const block = useBlock();

	const treat = useTreat();

	const treatNftMinterContract = getTreatNFTMinterContract(treat);
	const treatMarketplaceAddress = getTreatMarketplaceAddress(treat);

	const fetchAllowance = useCallback(async () => {
		if (treat) {
			const _allowance = await getIsApprovedForAll(
				treatNftMinterContract,
				treatMarketplaceAddress,
				account
			);
			setAllowance(_allowance);
		}
	}, [account, ethereum, tokenAddress]);

	useEffect(() => {
		if (account && ethereum) {
			fetchAllowance();
		}
	}, [account, ethereum, setAllowance, block, tokenAddress]);

	return allowance;
};

export default useGetMinterIsApprovedForAll;
