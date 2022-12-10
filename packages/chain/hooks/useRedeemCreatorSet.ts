import {getCreatorMartContract, redeemCreatorSet} from "@packages/chain/utils";

import {useCallback} from "react";
import {useAccount} from "wagmi";
import useTreat from "./useTreat";

const useRedeemCreatorSet = (id: number, treatCost: number) => {
	const {address: account} = useAccount();
	const treat = useTreat();
	const creatorMartContract = getCreatorMartContract(treat);

	const handleRedeemCreatorSet = useCallback(async () => {
		const txHash = await redeemCreatorSet(
			creatorMartContract,
			account,
			id,
			treatCost
		);

		return txHash;
	}, [account, id, treatCost, creatorMartContract]);

	return {onRedeemCreatorSet: handleRedeemCreatorSet};
};

export default useRedeemCreatorSet;
