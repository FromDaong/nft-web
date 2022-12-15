import {connectMongoDB} from "server/database/engine";
import {NextApiResponse} from "next";
import {NextApiRequest} from "next";
import {returnWithSuccess} from "server/database/engine/utils";
import {MongoModelTransaction} from "server/helpers/models";

export default async function Create(
	req: NextApiRequest,
	res: NextApiResponse
) {
	await connectMongoDB();

	const {body} = req;

	const tx = new MongoModelTransaction(body);
	await tx.save();

	return returnWithSuccess(tx, res);
}
