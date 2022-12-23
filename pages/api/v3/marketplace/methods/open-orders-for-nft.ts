import {returnWithSuccess} from "@db/engine/utils";
import {treatMarketplaceContract} from "@packages/treat/lib/contract-defs";
import {formatOpenOrders} from "@utils/chain-methods";
import {NextApiResponse} from "next";
import {NextApiRequest} from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const {id: nftId} = req.query;

	const sellers = await treatMarketplaceContract.getOpenOrdersForNft(nftId);
	const openOrders = await Promise.all(
		sellers.map((seller) => treatMarketplaceContract.orderBook(nftId, seller))
	);

	return returnWithSuccess(formatOpenOrders(openOrders), res);
};

export default handler;
