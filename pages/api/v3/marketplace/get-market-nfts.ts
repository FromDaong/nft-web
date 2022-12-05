import {returnWithError} from "./../../../../server/database/engine/utils";
import {NextApiResponse} from "next";
import {NextApiRequest} from "next";
import {
	connectMongoDB,
	getStringFromRedisCache,
	setStringToRedisCache,
} from "server/database/engine";
import {returnWithSuccess} from "server/database/engine/utils";
import LegacyNFTModel from "server/database/legacy/nft/NFT";

export default async function getMarketNfts(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const cached_nfts = await getStringFromRedisCache("nfts");
	if (cached_nfts) {
		return returnWithSuccess(cached_nfts, res);
	}
	await connectMongoDB();
	const market_nfts = await LegacyNFTModel.find({
		old_totw: false,
		old_totm: false,
		melon_nft: false,
		subscription_nft: false,
	}).limit(10);

	if (!market_nfts) {
		return returnWithError("No  NFTs found", 404, res);
	}
	await setStringToRedisCache("nfts", market_nfts);
	return returnWithSuccess(market_nfts, res);
}
