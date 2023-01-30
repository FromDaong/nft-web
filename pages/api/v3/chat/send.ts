import Pusher from "pusher";
import {NextApiResponse} from "next";
import {NextApiRequest} from "next";
import {returnWithError, returnWithSuccess} from "server/helpers/core/utils";

async function handler(req: NextApiRequest, res: NextApiResponse) {
	const {chat_id, message} = req.body;
	const pusher = new Pusher({
		key: "68ea1848874450546ae7",
		appId: "1376129",
		secret: "58b196827262f0491e26",
		cluster: "us2",
	});

	const trigger = await pusher.trigger(chat_id, "new-message", {...message});

	if (!trigger.ok) {
		return returnWithError("Could not trigger", 500, res);
	}

	return returnWithSuccess({chat_id, message}, res);
}

export default handler;
