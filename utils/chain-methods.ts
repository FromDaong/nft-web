import {ethers} from "ethers";

export const formatOpenOrders = (openOrders) =>
	openOrders.map((o) => {
		const order = {...o};
		return {
			seller: order.seller,
			nftId: Number(order.nftId.toString()),
			price: Number(ethers.utils.formatEther(order.price)),
		};
	});
