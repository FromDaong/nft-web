import {connectMongoDB} from "server/database/engine";
import {NextApiResponse} from "next";
import {NextApiRequest} from "next";
import LegacyNFTModel from "server/database/legacy/nft/NFT";
import {
	enforcePrivacyForNFTs,
	returnWithSuccess,
} from "server/database/engine/utils";
import {MongoModelCreator} from "server/database/models/creator";
import LegacyCreatorModel from "@db/legacy/profile/Creator";
import {MongoModelNFT} from "server/helpers/models";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	await connectMongoDB();

	const {username, subscription_nft} = req.query;

	if (!username) {
		return res.status(400).json({error: "No username provided"});
	}

	const creator = await MongoModelCreator.findOne({username});

	if (!creator) {
		return res.status(404).json({error: "Creator not found"});
	}

	const CreatorNFTS = await MongoModelNFT.find({
		creator: creator._id,
		subscription_nft: subscription_nft === "true" ? true : false,
	}).populate("creator");

	return returnWithSuccess(CreatorNFTS, res);
}
