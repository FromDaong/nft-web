import {returnWithSuccess} from "@db/engine/utils";
import {treatSubscriptionContract} from "@packages/treat/lib/contract-defs";
import {NextApiResponse} from "next";
import {NextApiRequest} from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const {id} = req.query;

	const setCost = await treatSubscriptionContract.nftSetCosts(id);

	return returnWithSuccess(setCost, res);
};

export default handler;
