import {useCallback} from "react";
import {useAccount} from "wagmi";
import {useContracts} from "@packages/post/hooks";

const useCreateBulkTotwNFTs = (
	maxSupplys: Array<number>,
	creatorAddress: string
) => {
	const {address: account} = useAccount();
	const {totwMinterHelperContract} = useContracts();

	const handleCreateBulkTotwNFTs = useCallback(async () => {
		const result = await totwMinterHelperContract.createTreats(
			maxSupplys,
			creatorAddress,
			{from: account, value: 0}
		);

		return result.events.TotwNftsCreated.returnValues;
	}, [account, maxSupplys, creatorAddress, totwMinterHelperContract]);

	return {onCreateBulkTotwNFTs: handleCreateBulkTotwNFTs};
};

export default useCreateBulkTotwNFTs;
