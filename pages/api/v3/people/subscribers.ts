// endpoint to give subscribers for creator profile

import {
	profileSelectList,
	returnWithError,
	returnWithSuccess,
} from "@db/engine/utils";
import {NextApiRequest, NextApiResponse} from "next";
import treatDatabase from "server/helpers";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const {creator} = req.query;
	// get _id of creator
	const creator_doc = await treatDatabase.models.MongoModelCreator.findOne({
		username: creator,
	});

	if (!creator_doc) {
		return returnWithError("Creator not found", 404, res);
	}

	// get subscribers
	const subscribers = await treatDatabase.models.MongoModelSubscribedBy.find({
		subscribedTo: creator_doc._id,
	});

	// get profiles
	const profiles = await treatDatabase.models.MongoModelProfile.find({
		_id: {
			$in: subscribers.map((subscriber) => subscriber.subscribedBy),
		},
	}).select(profileSelectList);

	return returnWithSuccess(profiles, res);
}
