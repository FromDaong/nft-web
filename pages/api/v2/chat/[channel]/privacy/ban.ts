import Ban from "@models/privacy/Ban";
import Model from "@models/Model";
import { withJWTAuth } from "./../../../../../../utils/server-utils";
const enforceIsHost = (handler) => async (req, res) => {
  const { ethAddress } = req.session;

  const host = await Model.findOne({});
  if (`${ethAddress}`.toUpperCase() === `${host.address}`.toUpperCase()) {
    handler(req, res);
  } else {
    res.status(401).json({ error: "UnAuthorized" });
  }
};

export async function ban(req, res) {
  const { channel } = req.query;

  try {
    const { toggle } = req.body;
    if (toggle === "ban") {
      const { address, expires } = req.body;
      const ban = new Ban({
        address,
        expires,
        channel,
      });
      await ban.save();
      res.status(200).json({ success: true });
    } else if (toggle === "unban") {
      await Ban.deleteOne({ address: req.body.address, channel });
      res.status(200).json({ success: true });
    } else {
      const banned = await Ban.findOne({ channel });
      res.status(200).json({ banned });
    }
    return;
  } catch (err) {
    return res.status(500).send("Error banning user");
  }
}

export default withJWTAuth(enforceIsHost(ban));
