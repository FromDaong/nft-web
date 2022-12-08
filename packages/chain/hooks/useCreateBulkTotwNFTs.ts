import {
	createBulkTotwNFTs,
	getTotwMinterHelperContract,
} from "@packages/chain/utils";

import {useCallback} from "react";
import {useAccount} from "wagmi";
import useTreat from "./useTreat";

const useCreateBulkTotwNFTs = (
	maxSupplys: Array<number>,
	creatorAddress: string
) => {
	const {address: account} = useAccount();
	const treat = useTreat();
	const totwMinterHelperContract = getTotwMinterHelperContract(treat);

	const handleCreateBulkTotwNFTs = useCallback(async () => {
		const res = await createBulkTotwNFTs(
			totwMinterHelperContract,
			account,
			maxSupplys,
			creatorAddress
		);

		return res;
	}, [account, maxSupplys, creatorAddress, totwMinterHelperContract]);

	return {onCreateBulkTotwNFTs: handleCreateBulkTotwNFTs};
};

export default useCreateBulkTotwNFTs;
