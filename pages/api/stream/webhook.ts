import { NextApiRequest, NextApiResponse } from "next";

import Model from "../../../models/Model";

// enable this webhook to set live

const livestream_hook = async (req: NextApiRequest, res: NextApiResponse) => {
  const { body } = req;
  if (!body || !body.webhookId || !body.event || !body.stream) {
    res.status(400).json({ success: false });
    return;
  }

  const { event, stream } = body;

  try {
    const model = await Model.findOneAndUpdate(
      {
        "live.playback_id": stream.playback_id,
      },
      {
        livestream_active: event === "stream.started" ? true : false,
      },
      { new: true }
    );
    console.log({ model });
    res.status(200).json({ error: false });
  } catch (err) {
    console.log({ err });
    res.status(400).json({ error: true, message: err });
  }
};

export default livestream_hook;
