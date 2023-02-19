import {connectMongoDB} from "server/database/engine";
import {NextApiResponse} from "next";
import {NextApiRequest} from "next";
import {returnWithSuccess} from "server/database/engine/utils";
import {MongoModelCreator} from "server/helpers/models";
import {MongoModelNFT} from "server/helpers/models";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	await connectMongoDB();

	const {page, username} = req.query;

	const get_page = Number(page ?? 1) || 1;
	if (!username) {
		return res.status(400).json({error: "No username provided"});
	}

	const creator = await MongoModelCreator.findOne({username});


	if (!creator) {
		return res.status(404).json({error: "Creator not found"});
	}

	// @ts-ignore
	const creatorNFTs = await MongoModelNFT.find({
		creator: creator._id,
	})
		.populate("creator")
		.limit(3)
		.exec();

	return returnWithSuccess(creatorNFTs, res);
}
