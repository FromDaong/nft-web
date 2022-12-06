import {ModelCreator} from "@db/models/creator";
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
	await connectMongoDB();

	const {username} = req.query;

	if (!username) {
		return res.status(400).json({error: "No username provided"});
	}

	const Creator = await ModelCreator.findOne({username});

	if (!Creator) {
		return res.status(404).json({error: "Creator not found"});
	}

	const CreatorNFTS = await LegacyNFTModel.find({
		model_handle: Creator.username,
	});

	return returnWithSuccess(enforcePrivacyForNFTs(CreatorNFTS), res);
}
