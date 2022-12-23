import {returnWithError, returnWithSuccess} from "@db/engine/utils";
import {
	creatorMartContract,
	totmMartContract,
	treatSubscriptionContract,
} from "@packages/treat/lib/contract-defs";
import {NextApiResponse} from "next";
import {NextApiRequest} from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const {id, nft_type} = req.query;

	if (nft_type === "creator") {
		const nft_cost = await creatorMartContract.nftCosts(id);
		return returnWithSuccess(nft_cost, res);
	}

	if (nft_type === "subscription") {
		const nft_cost = await treatSubscriptionContract.nftCosts(id);
		return returnWithSuccess(nft_cost, res);
	}

	if (nft_type === "totm") {
		const nft_cost = await totmMartContract.nftCosts(id);
		return returnWithSuccess(nft_cost, res);
	}

	return returnWithError("Invalid NFT type", 401, res);
};

export default handler;
