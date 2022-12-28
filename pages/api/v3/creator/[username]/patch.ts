import {connectMongoDB} from "server/database/engine";
import {NextApiResponse} from "next";
import {NextApiRequest} from "next";
import {returnWithError, returnWithSuccess} from "server/database/engine/utils";
import {MongoModelCreator} from "server/helpers/models";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const {username} = req.query;
	const {data} = req.body;

	if (!username) {
		return returnWithError("No ID provided", 400, res);
	}

	await connectMongoDB();

	try {
		// Edit fields of nft and set data to them and save
		// Do not update price

		if (data.username) {
			delete data.username;
		}

		const creator = await MongoModelCreator.findOneAndUpdate(
			{username},
			{...data},
			{new: true}
		);

		return returnWithSuccess(creator, res);
	} catch (err) {
		return returnWithError(err, 400, res);
	}
}
