import Model from "../../../../db/models/Model";
import dbConnect from "../../../../utils/dbConnect";

dbConnect();

export default async (req, res) => {
  const {
    query: { _id },
    method,
  } = req;

  switch (method) {
    case "GET":
      try {
        let modelRes = await Model.findOne({
          address: `${_id}`.toUpperCase(),
        });

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
