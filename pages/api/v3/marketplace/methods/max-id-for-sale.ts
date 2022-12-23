import {returnWithSuccess} from "@db/engine/utils";
import {treatMarketplaceContract} from "@packages/treat/lib/contract-defs";
import {NextApiResponse} from "next";
import {NextApiRequest} from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const maxIdForSale = await treatMarketplaceContract.maxTokenId();

	return returnWithSuccess(maxIdForSale, res);
};

export default handler;
