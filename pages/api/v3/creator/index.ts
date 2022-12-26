import {connectMongoDB} from "server/database/engine";
import {returnWithError, returnWithSuccess} from "server/database/engine/utils";
import {MongoModelCreator} from "server/helpers/models";
import {NextApiRequest, NextApiResponse} from "next";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	await connectMongoDB();

	try {
		const creatorProfile = await MongoModelCreator.find();

		return returnWithSuccess(creatorProfile, res);
	} catch (err) {
		return returnWithError(err, 400, res);
	}
}
