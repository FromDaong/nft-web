import {returnWithError} from "./../../../../server/database/engine/utils";
import {NextApiResponse} from "next";
import {NextApiRequest} from "next";
import {
	connectMongoDB,
	getStringFromRedisCache,
	setStringToRedisCache,
} from "server/database/engine";
import {returnWithSuccess} from "server/database/engine/utils";
import LegacyCreatorModel from "server/database/legacy/creator/Creator";
import LegacyNFTModel from "server/database/legacy/nft/NFT";

export default async function totm(req: NextApiRequest, res: NextApiResponse) {
	const cached_totm = await getStringFromRedisCache("totm");
	if (cached_totm) {
		return returnWithSuccess(cached_totm, res);
	}

	await connectMongoDB();
	const totm_model = await LegacyCreatorModel.findOne({totm: true});

	if (!totm_model) {
		return returnWithError("No TOTM model found", 404, res);
	}

	const totm_nfts = await LegacyNFTModel.find({
		model_handle: totm_model.username,
	});

	await setStringToRedisCache("totm", totm_nfts);

	return returnWithSuccess(totm_nfts, res);
}
