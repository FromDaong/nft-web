// create collection endpoint

import {returnWithError, returnWithSuccess} from "@db/engine/utils";
import {NextApiRequest, NextApiResponse} from "next";
import {
	MongoModelCollection,
	MongoModelCreator,
	MongoModelProfile,
} from "server/helpers/models";
import {protectedAPIRoute} from "server/utils";

// Path: pages\api\v3\marketplace\collection\create.ts

async function handler(req: NextApiRequest, res: NextApiResponse) {
	const {name} = req.body;

	const profile = await MongoModelProfile.findOne({
		address: req.session.address.toLowerCase(),
	});

	if (!profile) {
		return returnWithError("Profile not found", 404, res);
	}

	const creator = await MongoModelCreator.findOne({
		username: profile._id,
	});

	if (!name) {
		return returnWithError("Missing data", 500, res);
	}

	const collection = new MongoModelCollection({
		name,
		creator: creator._id,
	});

	await collection.save();

	return returnWithSuccess({id: collection._id}, res);
}

export default protectedAPIRoute(handler);
