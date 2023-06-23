import {useCallback} from "react";
import {useAccount} from "wagmi";
import {useContracts} from "@packages/post/hooks";

const useAddReferrerToMinter = (modelAddress: string, refAddress: string) => {
	const {address: account} = useAccount();
	const {treatMinterContract} = useContracts();

	const handleAddReferrerToMinter = useCallback(async () => {
		const txHash = await treatMinterContract.addTreatReferrer(
			modelAddress,
			refAddress,
			{from: account, value: 0}
		);

		return txHash;
	}, [account, modelAddress, refAddress, treatMinterContract]);

	return {onAddReferrerToMinter: handleAddReferrerToMinter};
};

export default useAddReferrerToMinter;
