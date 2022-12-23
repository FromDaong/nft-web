import {NextApiResponse, NextApiRequest} from "next";
import {protectedAPIRoute} from "server/utils";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	// T-36 get the graph of following for the user with depth of 3
	// T-37 fetch timeline for user from db by doing an aggregate query for activity from ids in their graph of following

	return {
		timeline: [{}],
		timestamp: 0,
		lastUpdated: 0,
		lastRead: 0,
		nextUpdate: 0,
		profile: "",
	};
};

export default protectedAPIRoute(handler);
