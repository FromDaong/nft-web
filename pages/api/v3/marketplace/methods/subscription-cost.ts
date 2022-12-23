import {returnWithSuccess} from "@db/engine/utils";
import {treatSubscriptionContract} from "@packages/treat/lib/contract-defs";
import {NextApiResponse} from "next";
import {NextApiRequest} from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const {address} = req.query;

	const subscriptionCost =
		await treatSubscriptionContract.creatorSubscriptionCost(address);

	return returnWithSuccess(subscriptionCost, res);
};

export default handler;
