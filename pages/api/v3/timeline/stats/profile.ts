import {NextApiResponse, NextApiRequest} from "next";
import {protectedAPIRoute} from "server/utils";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	return {
		followers: 0,
		following: 0,
		posts: 0,
		likes: 0,
		subscriptions: 0,
		collections: 0,
	};
};

export default protectedAPIRoute(handler);
