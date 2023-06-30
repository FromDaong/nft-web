import {returnWithSuccess} from "@db/engine/utils";
import {NextApiRequest, NextApiResponse} from "next";
import {connectMongoDB} from "server/helpers/core";
import {MongoModelCollection} from "server/helpers/models";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	await connectMongoDB();
	const {seller_id} = req.query;

	const collections = await MongoModelCollection.find({
		creator: seller_id,
	}).populate("creator");

	return returnWithSuccess(collections, res);
}
