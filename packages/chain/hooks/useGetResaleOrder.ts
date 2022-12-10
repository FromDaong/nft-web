import {useEffect, useState} from "react";
import {
	getTreatMarketplaceContract,
	getResaleOrder,
} from "@packages/chain/utils";
import useTreat from "./useTreat";

export interface ResaleOrder {
	seller: string;
	creator: string;
	nftId: number;
	quantity: number;
	price: number;
	listDate: number;
	expiresDate: number;
	closedDate: number;
}

const useGetResaleOrder = (nftId: number, seller: string) => {
	const [order, setOrder] = useState<ResaleOrder>();
	const treat = useTreat();

	const treatMarketplaceContract = getTreatMarketplaceContract(treat);

	useEffect(() => {
		async function fetchOrder() {
			const _order = await getResaleOrder(
				treatMarketplaceContract,
				nftId,
				seller
			);
			setOrder(_order);
		}

		if (treat) {
			fetchOrder();
		}
	}, [treat, nftId, seller]);

	return order;
};

export default useGetResaleOrder;
