import {NextApiRequest, NextApiResponse} from "next/types";
import {connectMongoDB} from "server/helpers/core";
import {returnWithError, returnWithSuccess} from "server/helpers/core/utils";
import {MongoModelNFT} from "server/helpers/models";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	await connectMongoDB();

	const {nftId} = req.query;

	const nft = await MongoModelNFT.findOne({
		id: parseInt(nftId.toString()),
	}).populate("creator");

	if (!nft) return returnWithError("Not found", 404, res);

	return returnWithSuccess(nft, res);
}
