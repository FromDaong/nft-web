import {
	getTreatMarketplaceContract,
	purchaseOrder,
} from "@packages/chain/utils";

import {useCallback} from "react";
import {useAccount} from "wagmi";
import useTreat from "./useTreat";

const usePurchaseOrder = (
	nftId: number,
	quantity: number,
	price: number,
	seller: string
) => {
	const {address: account} = useAccount();
	const treat = useTreat();

	const treatMarketplaceContract = getTreatMarketplaceContract(treat);

	const handlePurchaseOrder = useCallback(async () => {
		const txHash = await purchaseOrder(
			treatMarketplaceContract,
			nftId,
			1,
			seller,
			account,
			Number(price)
		);

		return txHash;
	}, [account, nftId, quantity, price, seller]);

	return {onPurchaseOrder: handlePurchaseOrder};
};

export default usePurchaseOrder;
