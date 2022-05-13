import Ban from "@models/privacy/Ban";
import Model from "@models/Model";
import { nodePusher } from "@lib/pusher";
import { withJWTAuth } from "./../../../../../../utils/server-utils";

const enforceIsHost = (handler) => async (req, res) => {
  const { ethAddress } = req.session;
  const { channel } = req.query;

  const host = await Model.findOne({
    "live.playback_id": channel,
  });
  if (`${ethAddress}`.toUpperCase() === `${host.address}`.toUpperCase()) {
    handler(req, res);
  } else {
    res.status(401).json({ error: "UnAuthorized" });
  }
};

export async function ban(req, res) {
  const { channel } = req.query;
  const channelName = `live-${channel}`;
  const eventName = "ban-event";
  const data = {
    ...req.body,
    host: req.session.ethAddress,
  };

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
    } else if (toggle === "lift") {
      await Ban.deleteOne({ address: req.body.address, channel });
      res.status(200).json({ success: true });
    } else {
      const banned = await Ban.findOne({ channel });
      res.status(200).json({ banned });
    }

    await nodePusher.trigger(channelName, eventName, {
      ...data,
    });

    return;
  } catch (err) {
    return res.status(500).send("Error banning user");
  }
}

export default withJWTAuth(enforceIsHost(ban));
