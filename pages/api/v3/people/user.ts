import {connectMongoDB} from "@db/engine";
import {returnWithError, returnWithSuccess} from "@db/engine/utils";
import treatDatabase from "server/helpers";

export default async function handler(req, res) {
	await connectMongoDB();

	const {username} = req.query;

	if (!username) {
		return returnWithError("Missing data", 500, res);
	}

	const profile = await treatDatabase.models.MongoModelProfile.findOne({
		username,
	});

	if (!profile) {
		return returnWithSuccess({profile: null}, res);
	}

	return returnWithSuccess({profile}, res);
}
