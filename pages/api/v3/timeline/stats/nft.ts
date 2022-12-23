import {NextApiResponse, NextApiRequest} from "next";
import {protectedAPIRoute} from "server/utils";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	return {
		id: 23,
		total_likes: 0,
		total_sales: 0,
		total_views: 0,
		total_listings: 0,
		total_transactions: 0,
	};
};

export default protectedAPIRoute(handler);
