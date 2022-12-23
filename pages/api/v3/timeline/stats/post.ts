import {NextApiResponse, NextApiRequest} from "next";
import {protectedAPIRoute} from "server/utils";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	return {
		_id: "5f9f1b9b0b1b9b0b1b9b0b1b",
		nftId: 23,
		likes: 0,
		sales: 0,
		views: 0,
	};
};

export default protectedAPIRoute(handler);
