import { NextApiRequest, NextApiResponse } from "next";

import Model from "@models/Model";
import axios from "axios"
import dbConnect from "@utils/dbConnect";

// enable this webhook to set live
dbConnect();

const livestream_hook = async (req: NextApiRequest, res: NextApiResponse) => {
  const { body } = req;
  if (!body || !body.webhookId || !body.event || !body.stream) {
    res.status(400).json({ success: false });
    return;
  }

  const { event, stream } = body;

  try {
    const model = await Model.findOne({
      "live.stream_id": { $regex: new RegExp(stream.id, "i") },
    });
    console.log({model, stream, playback_id: model.live.playback_id, stream_playback_id: stream.playback_id, event})
    if (!model) {
      return res.status(200).json({ error: false });
    }

    if(!stream.isActive) {
      try{
        const stream_res = await axios.get(`/api/stream/${model.live.stream_id}`);
        await Model.findByIdAndUpdate(model._id, {
          livestream_active: stream_res.data.isActive ? true : false,
        });
      } catch(err) {
        await Model.findByIdAndUpdate(model._id, {
          livestream_active: stream.isActive ? true : false,
        });
      }
    } else {
      await Model.findByIdAndUpdate(model._id, {
        livestream_active: stream.isActive ? true : false,
      });
    }
    
    return res.status(200).json({ error: false });
  } catch (err) {
    console.log({ err });
    return res.status(400).json({ error: true, message: err });
  }
};

export default livestream_hook;
