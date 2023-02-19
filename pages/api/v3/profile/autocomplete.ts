import {connectMongoDB} from "server/database/engine";
import {returnWithError, returnWithSuccess} from "server/database/engine/utils";
import {NextApiRequest, NextApiResponse} from "next";
import {MongoModelCreator, MongoModelProfile} from "server/helpers/models";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const {q} = req.query;

	await connectMongoDB();

	try {
		const profiles = await MongoModelProfile.aggregate([
			{
				$search: {
					index: "profiles",
					text: {
						query: `${q}`,
						path: ["username", "bio", "display_name", "address"],
					},
				},
			},
			{
				$project: {
					_id: 1,
					username: 1,
					display_name: 1,
					bio: 1,
					address: 1,
				},
			},
		]);

		return returnWithSuccess(profiles, res);
	} catch (err) {
		console.log({err});
		return returnWithError(err, 400, res);
	}
}
