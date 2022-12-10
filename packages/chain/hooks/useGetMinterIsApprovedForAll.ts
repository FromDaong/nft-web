import {
	getTreatMarketplaceAddress,
	getTreatNFTMinterContract,
} from "@packages/chain/utils";
import {useCallback, useEffect, useState} from "react";

import useBlock from "./useBlock";
import {useAccount} from "wagmi";
import useTreat from "./useTreat";
import {getIsApprovedForAll} from "@utils/erc1155";

const useGetMinterIsApprovedForAll = (tokenAddress: string) => {
	const [allowance, setAllowance] = useState(false);
	const {address: account} = useAccount();
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
	}, [account, tokenAddress]);

	useEffect(() => {
		if (account) {
			fetchAllowance();
		}
	}, [account, setAllowance, block, tokenAddress]);

	return allowance;
};

export default useGetMinterIsApprovedForAll;
