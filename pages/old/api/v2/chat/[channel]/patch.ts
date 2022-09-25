import { Notification } from "@components/Live/types";
import NotificationModel from "../../../../../../db/models/Notification";
import { nodePusher } from "@lib/pusher";
import { withJWTAuth } from "@utils/server-utils";

async function patch(req, res) {
  const { action } = req.body;
  if (action === "delete") {
    try {
      const { channel } = req.query;

      const items = await NotificationModel.find({
        timestamp: { $lte: new Date().getTime() - 1000 * 60 * 60 * 60 * 24 },
        channel,
      });

      const data: Notification = {
        timestamp: new Date().getTime(),
        sent: true,
        index: "del-" + new Date().getTime(),
        type: "message",
        payload: {
          text: "Past messages auto-deleted by server",
          timestamp: new Date().getTime(),
          sender: "0x00000000000000000000000000000000",
        },
      };
      await new NotificationModel(data).save();
      const channelName = `live-${channel}`;
      const eventName = "live-message";
      await nodePusher.trigger(channelName, eventName, { ...data });

      Promise.all(
        items.map(async (i) => await NotificationModel.findByIdAndDelete(i._id))
      );
      return res.status(200).json({
        status: "success",
      });
    } catch (err) {
      console.log({ err });
      res.status(500).json({ error: "A server serror occured" });
    }
  } else {
    res.status(500).json({ error: "Unknown action" });
  }
  // Pull and delete all notifications older than 24 hrs except for tips
}

export default withJWTAuth(patch);
