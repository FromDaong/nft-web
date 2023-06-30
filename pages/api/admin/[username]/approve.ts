import withSession from "@lib/session";
import {connectMongoDB} from "server/helpers/core";
import {MongoModelCreator} from "server/helpers/models";

export default withSession(async (req, res) => {
	const {
		query: {username},
		method,
	} = req;

	await connectMongoDB();

	switch (method) {
		case "GET":
			try {
				const user = await req.session.get("admin");

				if (!user) {
					return res.status(200).json({failed: true});
				}

				const modelRes = await MongoModelCreator.updateOne(
					{username},
					{$set: {pending: false, rejected: false}}
				);

				if (!modelRes)
					return res
						.status(400)
						.json({success: false, error: "model not found"});

				const returnData = {...modelRes};

				res.status(200).json(returnData);
			} catch (error) {
				console.error({error});
				res.status(400).json({success: false, error: error});
			}
			break;
		default:
			res.status(400).json({success: false});
			break;
	}
});
