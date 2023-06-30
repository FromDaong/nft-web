import withSession from "@lib/session";
import {connectMongoDB} from "server/helpers/core";
import {MongoModelCreator} from "server/helpers/models";

export default withSession(async (req, res) => {
	const {method} = req;
	await connectMongoDB();

	switch (method) {
		case "GET":
			try {
				const user = await req.session.get("admin");

				if (!user) return res.status(400).json({success: false});

				const pendingModels = await MongoModelCreator.find({
					pending: true,
				}).populate("profile");
				const rejectedModels = await MongoModelCreator.find({
					pending: false,
					approved: false,
				}).populate("profile");
				const acceptedModels = await MongoModelCreator.find({
					$or: [
						{approved: true},
						{
							$and: [
								{
									approved: {
										$exists: false,
									},
								},
								{
									pending: false,
								},
							],
						},
					],
				}).populate("profile");

				res.status(200).json({pendingModels, rejectedModels, acceptedModels});
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
