import {
	getTreatNFTMinterContract,
	removePerformerFromMinter,
} from "@packages/chain/utils";

import {useCallback} from "react";
import {useAccount} from "wagmi";
import useTreat from "./useTreat";

const useRemovePerformerFromMinter = (modelAddress: string) => {
	const {address: account} = useAccount();
	const treat = useTreat();
	const treatNftMinterContract = getTreatNFTMinterContract(treat);

	const handleRemovePerformerFromMinter = useCallback(async () => {
		const txHash = await removePerformerFromMinter(
			treatNftMinterContract,
			account,
			modelAddress
		);
		return txHash;
	}, [account, modelAddress, treatNftMinterContract]);

	return {onRemovePerformerFromMinter: handleRemovePerformerFromMinter};
};

export default useRemovePerformerFromMinter;
