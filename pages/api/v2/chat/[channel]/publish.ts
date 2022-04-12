import Message from "../../../../../models/Message";
import NotificationModel from "../../../../../models/Notification";
import ReactionModel from "../../../../../models/Reaction";
import Tip from "../../../../../models/Tip";
import { nodePusher } from "../../../../../lib/pusher";
import { withJWTAuth } from "../../../../../utils/server-utils";

async function publish(req, res) {
  const { channel } = req.params;
  const { payload } = req.body;

  const { ethAddress } = req.session;
  // Publish to channel with pusher
  const channelName = `live-${channel}`;
  const eventName = "message";
  const data = {
    ethAddress,
    ...payload,
  };

  try {
    await new NotificationModel(payload).save();
    switch (payload.type) {
      case "message":
        await new Message(payload.payload).save();
        break;
      case "reaction":
        await new ReactionModel(payload.payload).save();
        break;
      case "tip":
        await new Tip(payload.payload).save();
        break;

      default:
        break;
    }

    await nodePusher.trigger(channelName, eventName, data);
    return res.status(200).json({ error: false });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: true });
  }
}

export default withJWTAuth(publish);
