import {connectMongoDB} from "server/database/engine";
import {NextApiResponse} from "next";
import {NextApiRequest} from "next";
import {returnWithError, returnWithSuccess} from "server/database/engine/utils";
import {MongoModelTransaction} from "server/helpers/models";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const {id} = req.query;
	if (!id) {
		return returnWithError("No ID provided", 400, res);
	}

	await connectMongoDB();

	const transactions = await MongoModelTransaction.findOne({
		metadata: {
			nftId: id,
		},
	});

	return returnWithSuccess(transactions, res);
}
