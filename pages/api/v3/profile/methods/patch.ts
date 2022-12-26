import {MongoModelProfile} from "server/helpers/models";
import {connectMongoDB} from "server/database/engine";
import {NextApiResponse} from "next";
import {NextApiRequest} from "next";
import {returnWithError, returnWithSuccess} from "server/database/engine/utils";
import {protectedAPIRoute} from "server/utils";

async function handler(req: NextApiRequest, res: NextApiResponse) {
	const data = req.body;
	const {session} = req;

	if (!data) {
		return returnWithError("No data provided", 400, res);
	}

	if (!session) {
		return returnWithError("No username provided", 400, res);
	}

	await connectMongoDB();

	const profile = await MongoModelProfile.findOne({
		address: session.address.toLowerCase(),
	});

	if (!profile) {
		return returnWithError("No profile found", 400, res);
	}

	try {
		// Edit fields of nft and set data to them and save
		// Do not update price

		if (data.username) {
			delete data.username;
		}

		const profile = await MongoModelProfile.findOneAndUpdate(
			{address: req.session.address.toLowerCase()},
			{
				$set: {
					...data,
				},
			},
			{new: true}
		);

		return returnWithSuccess(profile, res);
	} catch (err) {
		console.log(err);
		return returnWithError(err, 400, res);
	}
}

export default protectedAPIRoute(handler);
