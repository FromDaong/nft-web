import {returnWithSuccess} from "@db/engine/utils";
import {treatNFTMinterContract} from "@packages/treat/lib/contract-defs";
import {NextApiResponse} from "next";
import {NextApiRequest} from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const {id, address} = req.query;

	const nftBalance = await treatNFTMinterContract.balanceOf(address, id);

	return returnWithSuccess(nftBalance, res);
};

export default handler;
