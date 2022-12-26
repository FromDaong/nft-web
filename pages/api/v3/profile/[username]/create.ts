import {connectMongoDB} from "server/database/engine";
import {returnWithError, returnWithSuccess} from "server/database/engine/utils";
import {MongoModelProfile} from "server/helpers/models";
import {NextApiRequest, NextApiResponse} from "next";

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
		const usernameExists = await MongoModelProfile.find({
			username: data.username,
		});
		const emailExists = await MongoModelProfile.find({email: data.email});
		const addressExists = await MongoModelProfile.find({address: data.address});

		if (usernameExists.length > 0) {
			return returnWithError("Username already exists", 400, res);
		}

		if (emailExists.length > 0) {
			return returnWithError("Email already exists", 400, res);
		}

		if (addressExists.length > 0) {
			return returnWithError("Address already exists", 400, res);
		}

		const newProfile = new MongoModelProfile(data);
		await newProfile.save();
		return returnWithSuccess(newProfile, res);
	} catch (err) {
		return returnWithError(err, 400, res);
	}
}
