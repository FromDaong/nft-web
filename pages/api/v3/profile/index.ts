import {connectMongoDB} from "server/database/engine";
import {returnWithError, returnWithSuccess} from "server/database/engine/utils";
import {NextApiRequest, NextApiResponse} from "next";
import {MongoModelCreator} from "server/helpers/models";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	await connectMongoDB();

	try {
		const creators = await MongoModelCreator.find().populate("profile");
		return returnWithSuccess(creators, res);
	} catch (err) {
		console.log({err});
		return returnWithError(err, 400, res);
	}
}
