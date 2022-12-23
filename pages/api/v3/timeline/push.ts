import {NextApiResponse, NextApiRequest} from "next";
import {protectedAPIRoute} from "server/utils";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	return {
		message: "Ok",
	};
};

export default protectedAPIRoute(handler);
