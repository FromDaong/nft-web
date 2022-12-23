import {NextApiResponse, NextApiRequest} from "next";
import {connectMongoDB} from "server/helpers/core";
import {returnWithSuccess} from "server/helpers/core/utils";
import {MongoModelAnalytics} from "server/helpers/models";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	await connectMongoDB();
	const {event_type, metadata, timestamp} = req.body;

	const event = new MongoModelAnalytics({
		event_type,
		metadata,
		timestamp,
	});

	await event.save();

	return returnWithSuccess({success: true}, res);
};

export default handler;
