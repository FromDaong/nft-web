import Model from "../../../../db/models/Model";
import dbConnect from "../../../../utils/dbConnect";

dbConnect();

export default async (req, res) => {
  const {
    query: { address },
    method,
  } = req;

  switch (method) {
    case "GET":
      try {
        const modelRes = await Model.findOne({
          address: `${address}`.toLowerCase(),
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
