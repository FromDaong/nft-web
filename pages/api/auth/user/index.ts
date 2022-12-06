import {connectMongoDB} from "server/database/engine";
import {returnWithError, returnWithSuccess} from "@db/engine/utils";
import {NextApiRequest, NextApiResponse} from "next";
import {MongoModelUser} from "@db/models/creator";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const {data} = req.body;

	if (!data) {
		return returnWithError("No data provided", 400, res);
	}

	await connectMongoDB();

	try {
		const user = MongoModelUser.find({address: data.address});
		return returnWithSuccess(user, res);
	} catch (err) {
		return returnWithError(err, 400, res);
	}
}
