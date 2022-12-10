import {getTreatMarketplaceContract, listOrder} from "@packages/chain/utils";

import {useCallback} from "react";
import {useAccount} from "wagmi";
import useTreat from "./useTreat";

const useListOrder = () => {
	const {address: account} = useAccount();
	const treat = useTreat();

	const treatMarketplaceContract = getTreatMarketplaceContract(treat);

	const handleListOrder = useCallback(
		async (nftId: number, quantity: number, price: number) => {
			const txHash = await listOrder(
				treatMarketplaceContract,
				account,
				nftId,
				quantity,
				price
			);
			return txHash;
		},
		[account]
	);

	return {onListOrder: handleListOrder};
};

export default useListOrder;
