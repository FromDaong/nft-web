import {useCallback} from "react";
import {useAccount} from "wagmi";
import {useContracts} from "@packages/post/hooks";

const useAddPerformerToMinter = (modelAddress: string) => {
	const {address: account} = useAccount();
	const {minterPermissionHelperContract} = useContracts();

	const handleAddPerformerToMinter = useCallback(async () => {
		const txHash = await await minterPermissionHelperContract.addPerformer(
			modelAddress,
			{from: account, value: 0}
		);
		return txHash;
	}, [account, modelAddress, minterPermissionHelperContract]);

	return {onAddPerformerToMinter: handleAddPerformerToMinter};
};

export default useAddPerformerToMinter;
