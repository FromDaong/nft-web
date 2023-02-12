import {returnWithError, returnWithSuccess} from "@db/engine/utils";
import {NextApiRequest, NextApiResponse} from "next";
import {MongoModelProfile} from "server/helpers/models";
import {protectedAPIRoute} from "server/utils";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const {session} = req;

	if (!session.address) {
		return returnWithError("Not logged in", 401, res);
	}

	const {_id} = req.query;

	await MongoModelProfile.findOneAndUpdate(
		{
			_id,
		},
		// add badge to badges array if it doesn't exist
		{
			isTeam: false,
			isCouncil: false,
		},
		{new: true}
	);

	return returnWithSuccess("Added", res);
};

export default protectedAPIRoute(handler);
