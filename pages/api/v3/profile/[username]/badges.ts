import {returnWithError, returnWithSuccess} from "@db/engine/utils";
import {NextApiRequest, NextApiResponse} from "next";
import {MongoModelProfile} from "server/helpers/models";
import {protectedAPIRoute} from "server/utils";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const {session} = req;

	if (!session.address) {
		return returnWithError("Not logged in", 401, res);
	}

	const {username} = req.query;
	const {badge} = req.body;

	const u = await MongoModelProfile.findOneAndUpdate(
		{
			username: username,
		},
		// add badge to badges array if it doesn't exist
		{
			isTeam: badge === "team" ? true : false,
			isCouncil: badge === "council" ? true : false,
		},
		{new: true}
	);

	console.log({u});

	return returnWithSuccess("Added", res);
};

export default protectedAPIRoute(handler);
