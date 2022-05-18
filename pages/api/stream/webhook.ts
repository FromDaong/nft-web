import { NextApiRequest, NextApiResponse } from "next";

import Model from "@models/Model";

// enable this webhook to set live

const livestream_hook = async (req: NextApiRequest, res: NextApiResponse) => {
  const { body } = req;
  if (!body || !body.webhookId || !body.event || !body.stream) {
    res.status(400).json({ success: false });
    return;
  }

  const { event, stream } = body;

  try {
    const model = await Model.findOne({
      "live.playback_id": stream.playback_id,
    });
    if (!model) {
      return res.status(200).json({ error: false });
    }
    const updated_model = await Model.findByIdAndUpdate(
      model._id,
      {
        livestream_active: event === "stream.started" ? true : false,
      },
      { new: true }
    );
    console.log({ updated_model });
    return res.status(200).json({ error: false });
  } catch (err) {
    console.log({ err });
    return res.status(400).json({ error: true, message: err });
  }
};

export default livestream_hook;
