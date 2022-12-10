import {returnWithError, returnWithSuccess} from "@db/engine/utils";
import {NextApiRequest, NextApiResponse} from "next";
import {connectMongoDB} from "server/helpers/core";
import {MongoModelCollection} from "server/helpers/models";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	await connectMongoDB();

	const {collection_id} = req.query;

	const collection = await MongoModelCollection.findOne({
		_id: collection_id,
	}).populate("creator");

	if (!collection) {
		return returnWithError("Collection not found", 404, res);
	}

	return returnWithSuccess(collection, res);
}
