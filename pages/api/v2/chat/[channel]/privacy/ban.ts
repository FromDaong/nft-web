import { NextApiRequest, NextApiResponse } from "next";

import Ban from "@models/privacy/Ban";
import Model from "@models/Model";
import axios from "axios";
import { nodePusher } from "@lib/pusher";
import { withJWTAuth } from "./../../../../../../utils/server-utils";

const enforceIsHost =
  (handler) => async (req: NextApiRequest, res: NextApiResponse) => {
    //@ts-ignore
    const { ethAddress } = req.session;
    const { channel } = req.query;
    try {
      const host_req = await axios.get(
        `${req.body.url}/api/v2/chat/${channel}/utils/get_host`
      );
      const host = host_req.data.host;
      if (`${ethAddress}`.toUpperCase() === `${host}`.toUpperCase()) {
        handler(req, res);
      } else {
        console.log({ ethAddress, host });
        res.status(401).json({ error: "UnAuthorized" });
      }
    } catch (err) {
      console.log({ err });
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
  delete data.url;

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
      const banned = await Ban.find({ channel });
      res.status(200).json([...banned]);
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
