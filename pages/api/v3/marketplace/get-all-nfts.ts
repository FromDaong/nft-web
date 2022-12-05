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

export default async function getAllNfts(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const cached_nfts = await getStringFromRedisCache("nfts");
	if (cached_nfts) {
		return returnWithSuccess(cached_nfts, res);
	}
	await connectMongoDB();
	const all_nfts = await LegacyNFTModel.find().limit(10);

	if (!all_nfts) {
		return returnWithError("No  NFTs found", 404, res);
	}
	await setStringToRedisCache("nfts", all_nfts);
	return returnWithSuccess(all_nfts, res);
}
