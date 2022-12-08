import {
	addCreatorFreeTreat,
	getCreatorMartContract,
} from "@packages/chain/utils";

import {useCallback} from "react";
import {useAccount} from "wagmi";
import useTreat from "./useTreat";

const useAddCreatorFreeTreat = (ids: Array<number>) => {
	const {address: account} = useAccount();
	const treat = useTreat();
	const creatorMartContract = getCreatorMartContract(treat);

	const handleAddCreatorFreeTreat = useCallback(async () => {
		const txHash = await addCreatorFreeTreat(creatorMartContract, account, ids);

		return txHash;
	}, [account, ids, creatorMartContract]);

	return {onAddCreatorFreeTreat: handleAddCreatorFreeTreat};
};

export default useAddCreatorFreeTreat;
