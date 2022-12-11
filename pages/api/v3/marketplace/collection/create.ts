// create collection endpoint

import {returnWithError, returnWithSuccess} from "@db/engine/utils";
import {ironOptions} from "@utils/index";
import {withIronSessionApiRoute} from "iron-session/next";
import {NextApiRequest, NextApiResponse} from "next";
import {connectMongoDB} from "server/helpers/core";
import {
	MongoModelCollection,
	MongoModelCreator,
	MongoModelProfile,
} from "server/helpers/models";
import {requireApiAuth} from "server/utils";

async function handler(req: NextApiRequest, res: NextApiResponse) {
	const {name} = req.body;

	if (!name) {
		return returnWithError({name: "Name is required"}, 500, res);
	}

	requireApiAuth(req, res);

	await connectMongoDB();

	const profile = await MongoModelProfile.findOne({
		address: req.session.siwe?.address.toLowerCase(),
	});

	if (!profile) {
		return returnWithError("Profile not found", 404, res);
	}

	const creator = await MongoModelCreator.findOne({
		profile: profile._id,
	});

	if (!creator) {
		return returnWithError("Creator not found", 404, res);
	}

	const collection = new MongoModelCollection({
		name,
		creator: creator._id,
	});

	await collection.save();

	return returnWithSuccess({id: collection._id}, res);
}

export default withIronSessionApiRoute(handler, ironOptions);
