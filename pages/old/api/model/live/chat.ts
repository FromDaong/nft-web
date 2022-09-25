import Model from "../../../../../db/models/Model";
import { withJWTAuth } from "../../../../../utils/server-utils";

async function chat(req, res) {
  if (req.method === "POST") {
    const { ethAddress } = req.session;
    const { live_chat_enabled } = req.body;
    try {
      const model = await Model.updateOne(
        {
          address: `${ethAddress}`.toLowerCase(),
        },
        {
          live_chat_enabled,
        },
        { new: true }
      );
      res.json(200).json({ ...model });
    } catch (err) {
      console.log({ err });
      res.status(500).json({
        error: err,
      });
    }
    req.json({ chat: "Edits" });
  } else {
    res.json({ chat: "Not known yet" });
  }
}

export default withJWTAuth(chat);
