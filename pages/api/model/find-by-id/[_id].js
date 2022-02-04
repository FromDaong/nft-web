import dbConnect from "../../../../utils/dbConnect";
import Model from "../../../../models/Model";

dbConnect();

export default async (req, res) => {
  const {
    query: { _id },
    method,
  } = req;

  switch (method) {
    case "GET":
      try {
        let modelRes = await Model.findOne({address: _id});

        if (!modelRes) return res.status(404);

        const returnData = { ...modelRes.toObject() };
        res.status(200).json(returnData);
      } catch (error) {
        console.error({ error });
        res.status(400).json({ success: false, error: error });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
};
