import {
	createNFTs,
	getCreatorMinterHelperContract,
} from "@packages/chain/utils";

import {useCallback} from "react";
import {useAccount} from "wagmi";
import useTreat from "./useTreat";

const useCreateNFTs = (maxSupplys: Array<number>) => {
	const {address: account} = useAccount();
	const treat = useTreat();
	const creatorMinterHelperContract = getCreatorMinterHelperContract(treat);

	const handleCreateAndAddNFTs = useCallback(async () => {
		const txHash = await createNFTs(
			creatorMinterHelperContract,
			account,
			maxSupplys
		);

		return txHash;
	}, [account, maxSupplys, creatorMinterHelperContract]);

	return {onCreateNFTs: handleCreateAndAddNFTs};
};

export default useCreateNFTs;
