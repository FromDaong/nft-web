import {connectMongoDB} from "server/database/engine";
import {NextApiResponse} from "next";
import {NextApiRequest} from "next";
import LegacyNFTModel from "server/database/legacy/nft/NFT";
import {
	enforcePrivacyForNFTs,
	populateNFTsWithProfileAndTx,
	returnWithSuccess,
} from "server/database/engine/utils";
import {MongoModelCreator, MongoModelNFT} from "server/helpers/models";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	/**
	 * 
	 * const {market_only, last_id, skip, limit, p, filter, sort, search} =
		req.query;

	const sortObj = {
		createdAt: sort.createdAt,
		price: sort.price,
	};
	const filterObj = {
		soldOut: filter.soldOut,
		if (market_only) {
		const market_nfts = await LegacyNFTModel.find({
			old_totw: false,
			old_totm: false,
			melon_nft: false,
			subscription_nft: false,
		}).limit(10);
		return returnWithSuccess(enforcePrivacyForNFTs(market_nfts), res);
	}
	};
	 */

	await connectMongoDB();
	const {page, market, sort} = req.query;

	const get_page = Number(page ?? 1) || 1;
	const options = {
		page: get_page,
		limit: 24,
	};

	let query = {};
	const sortQuery = {
		createdAt: sort !== "latest" ? 1 : -1,
		price: sort === "price" ? 1 : -1,
	};

	let NFTs;

	if (market) {
		query = {
			[(market as string) === "free" ? "price" : (market as string)]:
				market === "free" ? 0 : true,
		};
		// @ts-ignore
		NFTs = await MongoModelNFT.paginate(query, options);
	} else {
		// @ts-ignore
		NFTs = await MongoModelNFT.paginate({}, options);
	}

	// @ts-ignore

	NFTs.docs = await populateNFTsWithProfileAndTx(NFTs.docs);

	return returnWithSuccess(NFTs, res);
}
