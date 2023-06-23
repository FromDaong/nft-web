/* eslint-disable no-case-declarations */

import withSession from "@lib/session";
import {connectMongoDB} from "server/helpers/core";
import {MongoModelCreator} from "server/helpers/models";

const {PassbaseClient, PassbaseConfiguration} = require("@passbase/node");

const apiKey =
	"elBBJ5uEoadUIO99IwEKpmg3IvpzUz74UdSaxMMYcnJqYf1XRYpDlzXMXOMYMBeZrIVrC97SX0dE5GS0otGvZJ9OplGZXZKhqjGB0MctCFA5lmteuK1fzsH1Kkk405we";
const config = new PassbaseConfiguration({
	apiKey,
});
const client = new PassbaseClient(config);

export default withSession(async (req, res) => {
	const {
		query: {username},
		method,
	} = req;

	await connectMongoDB();

	switch (method) {
		case "GET":
			const user = await req.session.get("admin");
			const modelRes = await MongoModelCreator.findOne({username})
				.lean()
				.populate("profile");

			if (!user) return res.status(400).json({success: false});

			if (!modelRes)
				return res.status(400).json({success: false, error: "model not found"});

			if (modelRes.identity_access_key) {
				client
					.getIdentityById(modelRes.identity_access_key)
					.then((identity) => {
						const returnData = {...modelRes.toObject(), identity};
						res.status(200).json(returnData);
					})
					.catch((e) => {
						const returnData = {...modelRes.toObject(), identity: null};
						res.status(200).json(returnData);
					});
			} else {
				const returnData = {...modelRes.toObject(), identity: null};
				res.status(200).json(returnData);
			}
			break;
		default:
			res.status(400).json({success: false});
			break;
	}
});
