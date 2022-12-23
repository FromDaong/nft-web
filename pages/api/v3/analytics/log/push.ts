import {NextApiResponse, NextApiRequest} from "next";
import {connectMongoDB} from "server/helpers/core";
import {returnWithSuccess} from "server/helpers/core/utils";
import {MongoModelLog} from "server/helpers/models";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	await connectMongoDB();
	const {status, message, metadata, timestamp} = req.body;

	const log = new MongoModelLog({
		status,
		message,
		metadata,
		timestamp,
	});

	await log.save();

	return returnWithSuccess({success: true}, res);
};

export default handler;
