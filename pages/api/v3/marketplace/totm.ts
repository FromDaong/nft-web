import {NextApiResponse} from "next";
import {NextApiRequest} from "next";
import {connectMongoDB} from "server/database/engine";
import LegacyCreatorModel from "server/database/legacy/creator/Creator";
import LegacyNFTModel from "server/database/legacy/nft/NFT";

export default async function totm(req: NextApiRequest, res: NextApiResponse) {
	await connectMongoDB();

	const totm_model = await LegacyCreatorModel.findOne({totm: true});

	if (!totm_model) {
		return res.status(404).json({error: "No TOTM found"});
	}

	const totm_nfts = await LegacyNFTModel.find({
		model_handle: totm_model.username,
	});

	return res.status(200).json({
		data: totm_nfts,
		error: false,
	});
}
