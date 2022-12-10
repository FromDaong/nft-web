import {connectMongoDB} from "server/database/engine";
import {NextApiResponse} from "next";
import {NextApiRequest} from "next";
import LegacyNFTModel from "server/database/legacy/nft/NFT";
import {
	enforcePrivacyForNFTs,
	returnWithSuccess,
} from "server/database/engine/utils";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const {market_only} = req.query;

	await connectMongoDB();

	if (market_only) {
		const market_nfts = await LegacyNFTModel.find({
			old_totw: false,
			old_totm: false,
			melon_nft: false,
			subscription_nft: false,
		}).limit(10);
		return returnWithSuccess(enforcePrivacyForNFTs(market_nfts), res);
	}

	const NFTs = await LegacyNFTModel.find();
	return returnWithSuccess(enforcePrivacyForNFTs(NFTs), res);
}
