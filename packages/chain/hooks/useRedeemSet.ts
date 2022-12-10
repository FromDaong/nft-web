import {getTreatMartContract, redeemSet} from "@packages/chain/utils";

import {useCallback} from "react";
import {useAccount} from "wagmi";
import useTreat from "./useTreat";

const useRedeemSet = (id: number, treatCost: number) => {
	const {address: account} = useAccount();
	const treat = useTreat();
	const treatMartContract = getTreatMartContract(treat);

	const handleRedeemSet = useCallback(async () => {
		const txHash = await redeemSet(treatMartContract, account, id, treatCost);
		return txHash;
	}, [account, id, treatCost, treatMartContract]);

	return {onRedeemSet: handleRedeemSet};
};

export default useRedeemSet;
