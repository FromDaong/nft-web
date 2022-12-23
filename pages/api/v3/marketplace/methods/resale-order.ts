import {returnWithSuccess} from "@db/engine/utils";
import {treatMarketplaceContract} from "@packages/treat/lib/contract-defs";
import {NextApiResponse} from "next";
import {NextApiRequest} from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const {seller, nftId} = req.query;

	const remainingBalanceForOrder = await treatMarketplaceContract.orderBook(
		nftId,
		seller
	);

	return returnWithSuccess(remainingBalanceForOrder, res);
};

export default handler;
