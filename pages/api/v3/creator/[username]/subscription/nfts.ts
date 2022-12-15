import {connectMongoDB} from "server/database/engine";
import {NextApiResponse} from "next";
import {NextApiRequest} from "next";
import {returnWithSuccess} from "server/database/engine/utils";
import {MongoModelCreator} from "server/database/models/creator";
import {MongoModelNFT} from "server/helpers/models";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	await connectMongoDB();

	const {username} = req.query;

	if (!username) {
		return res.status(400).json({error: "No username provided"});
	}

	const creator = await MongoModelCreator.findOne({username});

	if (!creator) {
		return res.status(404).json({error: "Creator not found"});
	}

	const creatorNFTs = await MongoModelNFT.find({
		creator: creator._id,
		subscription_nft: true,
	}).populate("creator");

	return returnWithSuccess(creatorNFTs, res);
}
