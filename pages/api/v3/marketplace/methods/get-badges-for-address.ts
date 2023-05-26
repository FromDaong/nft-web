import {returnWithSuccess} from "@db/engine/utils";
import {treatNFTMinterContract} from "@packages/treat/lib/contract-defs";
import {NextApiResponse} from "next";
import {NextApiRequest} from "next";
import {returnWithError} from "server/helpers/core/utils";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const {address} = req.query;

	if (!address) {
		return returnWithError("No address provided", 400, res);
	}

	const isCreator = await treatNFTMinterContract.isPerformer(address);

	return returnWithSuccess(isCreator, res);
};

export default handler;
