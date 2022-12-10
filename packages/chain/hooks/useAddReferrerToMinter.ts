import {
	addReferrerToMinter,
	getTreatNFTMinterContract,
} from "@packages/chain/utils";

import {useCallback} from "react";
import {useAccount} from "wagmi";
import useTreat from "./useTreat";

const useAddReferrerToMinter = (modelAddress: string, refAddress: string) => {
	const {address: account} = useAccount();
	const treat = useTreat();
	const treatNftMinterContract = getTreatNFTMinterContract(treat);

	const handleAddReferrerToMinter = useCallback(async () => {
		const txHash = await addReferrerToMinter(
			treatNftMinterContract,
			account,
			modelAddress,
			refAddress
		);

		return txHash;
	}, [account, modelAddress, refAddress, treatNftMinterContract]);

	return {onAddReferrerToMinter: handleAddReferrerToMinter};
};

export default useAddReferrerToMinter;
