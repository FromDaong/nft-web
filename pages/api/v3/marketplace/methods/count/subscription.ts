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

	const {address} = req.query;

	if (!address) {
		return res.status(400).json({error: "No username provided"});
	}

	const creator = await MongoModelCreator.findOne({
		address: address.toString().toLowerCase(),
	});

	if (!creator) {
		return returnWithSuccess(0, res);
	}
	// @ts-ignore
	const creatorNFTs = await MongoModelNFT.find({
		creator: creator._id,
		subscription_nft: true,
	});

	return returnWithSuccess(creatorNFTs.length, res);
}
