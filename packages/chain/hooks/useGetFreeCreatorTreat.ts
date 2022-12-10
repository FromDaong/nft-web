import {
	getCreatorMartContract,
	mintFreeCreatorTreat,
} from "@packages/chain/utils";

import {useCallback} from "react";
import {useAccount} from "wagmi";
import useTreat from "./useTreat";

const useGetFreeCreatorTreat = (
	id: number,
	treatCost: number,
	useFreeCreatorTreats = false
) => {
	const {address: account} = useAccount();
	const treat = useTreat();
	const creatorMartContract = useFreeCreatorTreats
		? getCreatorMartContract(treat)
		: getCreatorMartContract(treat);

	const handleGetFreeCreatorTreat = useCallback(async () => {
		const txHash = await mintFreeCreatorTreat(creatorMartContract, account, id);

		return txHash;
	}, [account, id, treatCost, creatorMartContract]);

	return {onGetFreeCreatorTreat: handleGetFreeCreatorTreat};
};

export default useGetFreeCreatorTreat;
