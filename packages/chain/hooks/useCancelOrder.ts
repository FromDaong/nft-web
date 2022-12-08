import {cancelOrder, getTreatMarketplaceContract} from "@packages/chain/utils";

import {useCallback} from "react";
import {useAccount} from "wagmi";
import useTreat from "./useTreat";

const useCancelOrder = (nftId: number) => {
	const {address: account} = useAccount();
	const treat = useTreat();

	const treatMarketplaceContract = getTreatMarketplaceContract(treat);

	const handleCancelOrder = useCallback(async () => {
		const txHash = await cancelOrder(treatMarketplaceContract, nftId, account);

		return txHash;
	}, [account, nftId]);

	return {onCancelOrder: handleCancelOrder};
};

export default useCancelOrder;
