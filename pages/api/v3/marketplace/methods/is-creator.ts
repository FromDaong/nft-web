import {returnWithSuccess} from "@db/engine/utils";
import {treatNFTMinterContract} from "@packages/treat/lib/contract-defs";
import {NextApiResponse} from "next";
import {NextApiRequest} from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const {address} = req.query;

	const isCreator = await treatNFTMinterContract.isPerformer(address);

	return returnWithSuccess(isCreator, res);
};

export default handler;
