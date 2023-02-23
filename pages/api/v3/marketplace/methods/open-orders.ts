import {returnWithSuccess} from "@db/engine/utils";
import {
	treatMarketplaceContract,
	treatMarketplaceReaderContract,
} from "@packages/treat/lib/contract-defs";
import {formatOpenOrders} from "@utils/chain-methods";
import {NextApiResponse} from "next";
import {NextApiRequest} from "next";

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

	return returnWithSuccess(
		formatOpenOrders(openOrders.flat().filter((order) => !!order)),
		res
	);
};

export default handler;
