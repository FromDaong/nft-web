import {connectMongoDB} from "server/database/engine";
import {NextApiResponse} from "next";
import {NextApiRequest} from "next";
import {returnWithError, returnWithSuccess} from "server/database/engine/utils";
import {MongoModelNFT} from "server/helpers/models";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const {id} = req.query;
	const {name, description, isProtected} = req.body;

	const data = {
		name,
		description,
		protected: isProtected,
	};

	if (!id) {
		return returnWithError("No ID provided", 400, res);
	}

	await connectMongoDB();

	try {
		// Edit fields of nft and set data to them and save
		// Do not update price

		const nft = await MongoModelNFT.findByIdAndUpdate(
			id,
			{...data},
			{new: true}
		);

		return returnWithSuccess(nft, res);
	} catch (err) {
		console.log({err});
		return returnWithError(err, 400, res);
	}
}
