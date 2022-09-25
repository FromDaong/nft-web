import NotificationModel from "../../../../../../db/models/Notification";
import { withJWTAuth } from "@utils/server-utils";

async function chat(req, res) {
  const { channel } = req.data;

  try {
    const notifications = await NotificationModel.find({
      channel,
    });

    return res.status(200).json({
      error: false,
      notifications,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: true,
    });
  }
}

export default withJWTAuth(chat);
