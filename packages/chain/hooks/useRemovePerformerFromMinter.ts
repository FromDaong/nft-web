import {useCallback} from "react";
import {useAccount} from "wagmi";
import {useContracts} from "@packages/post/hooks";

const useRemovePerformerFromMinter = (modelAddress: string) => {
	const {address: account} = useAccount();
	const {treatMinterContract} = useContracts();

	const handleRemovePerformerFromMinter = useCallback(async () => {
		const txHash = await treatMinterContract.removePerformer(modelAddress, {
			from: account,
			value: 0,
		});
		return txHash;
	}, [account, modelAddress, treatMinterContract]);

	return {onRemovePerformerFromMinter: handleRemovePerformerFromMinter};
};

export default useRemovePerformerFromMinter;
