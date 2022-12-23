import {NextApiResponse, NextApiRequest} from "next";
import {protectedAPIRoute} from "server/utils";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	// T-38 fetch all events that have the user as a subject. Probably best to use their address for this
	return {
		timeline: [{}],
		totalActivity: 0,
		profile: "",
	};
};

export default protectedAPIRoute(handler);
