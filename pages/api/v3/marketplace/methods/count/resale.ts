import {returnWithSuccess} from "@db/engine/utils";
import {treatMarketplaceContract} from "@packages/treat/lib/contract-defs";
import {NextApiResponse} from "next";
import {NextApiRequest} from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const {address: seller} = req.query;

	const openOrdersNFTIds =
		await treatMarketplaceContract.getOpenOrdersForSeller(seller);

	const openOrdersForSeller = await Promise.all(
		openOrdersNFTIds.map((nftId) =>
			treatMarketplaceContract.orderBook(nftId, seller)
		)
	);

	return returnWithSuccess(openOrdersForSeller.length, res);
};

export default handler;
