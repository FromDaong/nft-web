import {
	connectMongoDB,
	getStringFromRedisCache,
	setStringToRedisCache,
} from "server/database/engine";
import {NextApiResponse} from "next";
import {NextApiRequest} from "next";
import {returnWithError, returnWithSuccess} from "server/database/engine/utils";
import ModelTransaction from "@db/models/transaction";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const {id} = req.query;
	if (!id) {
		return returnWithError("No ID provided", 400, res);
	}

	await connectMongoDB();

	const cached_totm = await getStringFromRedisCache(`transactions:${id}`);
	if (cached_totm) {
		return returnWithSuccess(cached_totm, res);
	}

	const transactions = await ModelTransaction.findOne({
		metadata: {
			nftId: id,
		},
	});

	await setStringToRedisCache(
		`transactions:${id}`,
		JSON.stringify(transactions)
	);

	return returnWithSuccess(transactions, res);
}
