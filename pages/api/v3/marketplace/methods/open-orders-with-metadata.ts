/* eslint-disable no-mixed-spaces-and-tabs */

import {returnWithSuccess} from "@db/engine/utils";
import {
	treatMarketplaceContract,
	treatMarketplaceReaderContract,
} from "@packages/treat/lib/contract-defs";
import {formatOpenOrders} from "@utils/chain-methods";
import {NextApiResponse} from "next";
import {NextApiRequest} from "next";
import {connectMongoDB} from "server/helpers/core";
import {MongoModelNFT} from "server/helpers/models";

const getMinMaxArray = (num) => {
	const arr = [];
	for (let i = 0; i < num; i += 50) {
		arr.push({
			min: i,
			max: i + 50,
		});
	}
	return arr;
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	await connectMongoDB();

	const {page, q, sort} = req.query;

	const sortMap = {
		"1": {
			price: 1,
		},
		"2": {
			price: -1,
		},
		"3": {
			listedDate: -1,
		},
	};

	const maxId = await treatMarketplaceContract.maxTokenId();
	const minMax = getMinMaxArray(maxId.toNumber());

	const openOrders = await Promise.all(
		minMax.map(async (a) => {
			const orders =
				await treatMarketplaceReaderContract.readOrderPricesForNftRange(
					a.min,
					a.max
				);

			const res = orders.sellers.map((o, i) => {
				return {
					seller: o,
					price: orders.prices[i],
					nftId: Number(orders.nftIds[i]),
					listDate: orders.listDates[i],
				};
			});
			return res;
		})
	);

	const orderIds = formatOpenOrders(
		openOrders.flat().filter((order) => !!order)
	);

	const aggregate = MongoModelNFT.aggregate([
		{
			$match: {
				id: {$in: orderIds.map((order) => order.nftId)},
			},
		},
		{
			$sort: {
				...(sort && sortMap[sort as string]
					? sortMap[sort as string]
					: {
							price: -1,
					  }),
			},
		},
	]);

	const options = {
		page: page ?? 1,
		limit: 24,
		collation: {
			locale: "en",
		},
	};

	// @ts-ignore
	const nfts = await MongoModelNFT.aggregatePaginate(aggregate, options);

	nfts.docs = nfts.docs.map((doc) => {
		const openOrder = orderIds.find((order) => order.nftId === doc.id);
		return {
			...doc,
			openOrder,
		};
	});

	return returnWithSuccess(nfts, res);
};

export default handler;
