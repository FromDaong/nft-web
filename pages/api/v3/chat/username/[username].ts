import {NextApiResponse} from "next";
import {NextApiRequest} from "next";
import {returnWithError, returnWithSuccess} from "server/helpers/core/utils";
import {MongoModelProfile} from "server/helpers/models";
import {protectedAPIRoute} from "server/utils";
import {connectMongoDB} from "server/helpers/core";

async function handler(req: NextApiRequest, res: NextApiResponse) {
	const {username} = req.query;

	const {address} = req.session;
	if (!address) {
		return returnWithError("Not logged in", 401, res);
	}

	await connectMongoDB();

	const loggedInProfile = await MongoModelProfile.findOne({address});
	const otherChatParticipant = await MongoModelProfile.findOne({username});

	if (!loggedInProfile || !otherChatParticipant) {
		return returnWithError("Could not find profile", 404, res);
	}

	return returnWithSuccess(
		{
			id: loggedInProfile._id + "-" + otherChatParticipant._id,
		},
		res
	);
}

export default protectedAPIRoute(handler);
