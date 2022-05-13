import Message from "../../../../../db/models/Message";
import { Notification } from "../../../../../components/Live/types";
import NotificationModel from "../../../../../db/models/Notification";
import ReactionModel from "../../../../../db/models/Reaction";
import Tip from "../../../../../db/models/Tip";
import { nodePusher } from "../../../../../lib/pusher";
import { withJWTAuth } from "../../../../../utils/server-utils";

async function publish(req, res) {
  const { channel } = req.query;
  const payload: Notification = req.body;

  // Publish to channel with pusher
  const channelName = `live-${channel}`;
  const eventName = "live-message";
  const data = {
    ...payload,
  };

  try {
    if (payload.type !== "reaction") {
      await new NotificationModel({
        ...payload,
        sent: true,
        channel: payload.channel,
      }).save();
    }
    switch (payload.type) {
      case "message":
        await new Message(payload.payload).save();
        break;
      case "tip":
        await new Tip(payload.payload).save();
        break;

      default:
        break;
    }
    if (payload.type === "kickout") {
      await nodePusher.trigger(channelName, "ban-event", {
        address: payload.target,
        host: req.session.ethAddress,
        toggle: payload.type,
      });
    } else {
      await nodePusher.trigger(channelName, eventName, {
        ...data,
        sent: true,
      });
    }

    await nodePusher.trigger(channelName, eventName, { ...data, sent: true });

    return res.status(200).json({ error: false });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: true });
  }
}

export default withJWTAuth(publish);
