import {connectMongoDB} from "server/database/engine";
import {NextApiResponse} from "next";
import {NextApiRequest} from "next";
import {returnWithSuccess} from "server/database/engine/utils";
import {MongoModelNFT} from "server/helpers/models";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	await connectMongoDB();

	const nfts = await MongoModelNFT.find({melon_nft: true}).populate({
		path: "creator",
		populate: "profile",
	});

	return returnWithSuccess(nfts, res);
}
