import Pusher from "pusher";
import {NextApiResponse} from "next";
import {NextApiRequest} from "next";
import {returnWithError, returnWithSuccess} from "server/helpers/core/utils";

async function handler(req: NextApiRequest, res: NextApiResponse) {
	const {chat_id, message} = req.body;
	const pusher = new Pusher({
		key: "app-key",
		host: "127.0.0.1",
		port: "6001",
		useTLS: false,
		appId: "app-id",
		secret: "app-secret",
	});

	const trigger = await pusher.trigger(chat_id, "new-message", {...message});

	if (!trigger.ok) {
		return returnWithError("Could not trigger", 500, res);
	}

	return returnWithSuccess({chat_id, message}, res);
}

export default handler;
