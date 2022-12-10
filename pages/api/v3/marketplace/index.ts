import {connectMongoDB} from "server/database/engine";
import {NextApiResponse} from "next";
import {NextApiRequest} from "next";
import LegacyNFTModel from "server/database/legacy/nft/NFT";
import {
	enforcePrivacyForNFTs,
	populateNFTsWithProfile,
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

	const NFTs = await MongoModelNFT.find()
		.populate({
			path: "creator",
			select: "username address bio profile",
			model: MongoModelCreator,
		})
		.limit(20);
	const nftsWithDp = await populateNFTsWithProfile(NFTs);

	return returnWithSuccess(nftsWithDp, res);
}
