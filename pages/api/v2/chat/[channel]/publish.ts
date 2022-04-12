import Message from "../../../../../models/Message";
import NotificationModel from "../../../../../models/Notification";
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
    new NotificationModel(payload).save();
    switch (payload.type) {
      case "message":
        new Message(payload.payload).save();
        break;
      case "reaction":
        break;

      case "tip":
        break;

      default:
        break;
    }
    nodePusher.trigger(channelName, eventName, data);

    return res.status(200).json({ error: false });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: true });
  }
}

export default withJWTAuth(publish);
