import {getTreatMartContract, mintFreeTreat} from "@packages/chain/utils";

import {useCallback} from "react";
import {useAccount} from "wagmi";
import useTreat from "./useTreat";

const useGetFreeTreat = (
	id: number,
	treatCost: number,
	useFreeTreats = false
) => {
	const {address: account} = useAccount();
	const treat = useTreat();
	const treatMartContract = useFreeTreats
		? getTreatMartContract(treat)
		: getTreatMartContract(treat);

	const handleGetFreeTreat = useCallback(async () => {
		const txHash = await mintFreeTreat(treatMartContract, account, id);

		return txHash;
	}, [account, id, treatCost, treatMartContract]);

	return {onGetFreeTreat: handleGetFreeTreat};
};

export default useGetFreeTreat;
