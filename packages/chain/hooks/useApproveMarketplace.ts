import {
	approveMarketplace,
	getTreatMarketplaceAddress,
	getTreatNFTMinterContract,
} from "@packages/chain/utils";

import {useCallback} from "react";
import {useAccount} from "wagmi";
import useTreat from "./useTreat";

const useApproveMarketplace = () => {
	const {address: account} = useAccount();
	const treat = useTreat();
	const treatNftMinterContract = getTreatNFTMinterContract(treat);
	const treatMarketplaceAddress = getTreatMarketplaceAddress(treat);

	const handleApprove = useCallback(async () => {
		try {
			const tx = await approveMarketplace(
				treatNftMinterContract,
				treatMarketplaceAddress,
				account
			);

			return tx;
		} catch (e) {
			console.error("errhandleApprove2 ", e);
			return false;
		}
	}, [account, treatNftMinterContract, treatMarketplaceAddress]);

	return {onApprove: handleApprove};
};

export default useApproveMarketplace;
