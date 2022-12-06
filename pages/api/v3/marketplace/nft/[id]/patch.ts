import {connectMongoDB} from "server/database/engine";
import {NextApiResponse} from "next";
import {NextApiRequest} from "next";
import LegacyNFTModel from "server/database/legacy/nft/NFT";
import {returnWithError, returnWithSuccess} from "server/database/engine/utils";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const {id} = req.query;
	const {data} = req.body;

	if (!id) {
		return returnWithError("No ID provided", 400, res);
	}

	await connectMongoDB();

	try {
		// Edit fields of nft and set data to them and save
		// Do not update price

		if (data.price) {
			delete data.price;
		}

		const nft = await LegacyNFTModel.findOneAndUpdate(
			{id},
			{...data},
			{new: true}
		);

		return returnWithSuccess(nft, res);
	} catch (err) {
		return returnWithError(err, 400, res);
	}
}
