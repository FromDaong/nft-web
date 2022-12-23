import {NextApiResponse, NextApiRequest} from "next";
import {protectedAPIRoute} from "server/utils";
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	// T-35 check the time + nextUpdate time, if passed generate new timeline and push to redis. Can use events to trigger this.

	return {
		timeline: [{}],
		timestamp: 0,
		lastUpdated: 0,
		lastRead: 0,
		nextUpdate: 0,
	};
};

export default protectedAPIRoute(handler);
