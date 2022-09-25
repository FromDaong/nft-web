import Model from "../../../../../../../db/models/Model";

export default async function getLivestreamHost(req, res) {
  try {
    const { channel } = req.query;
    const model = await Model.findOne({
      "live.playback_id": channel,
    });

    if (model) {
      res.json({
        host: model.address,
      });
    } else {
      res.status(404).json({
        error: true,
        message: "Model not found",
      });
    }
  } catch (err) {
    console.log({ err });
    res.status(400).json({
      error: true,
      message: err,
    });
  }
}
