import {
	getTreatNFTMinterContract,
	isAdminForMinter,
} from "@packages/chain/utils";

import {useCallback} from "react";
import {useAccount} from "wagmi";
import useTreat from "./useTreat";

const useGetIsNftAdmin = () => {
	const {address: account} = useAccount();
	const treat = useTreat();
	const treatNftMinterContract = getTreatNFTMinterContract(treat);

	const handleGetIsNftAdmin = useCallback(async () => {
		const txHash = await isAdminForMinter(treatNftMinterContract, account);

		return txHash;
	}, [account, treatNftMinterContract]);

	return {onGetIsNftAdmin: handleGetIsNftAdmin};
};

export default useGetIsNftAdmin;
