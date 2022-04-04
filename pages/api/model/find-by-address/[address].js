import Model from "../../../../models/Model";
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
        let modelRes = await Model.findOne({
          address: { $regex: new RegExp(address, "i") },
        });

        if (!modelRes) return res.status(200);

        const returnData = { ...modelRes.toObject() };

        return res.status(200).json(returnData);
      } catch (error) {
        console.error({ error });
        return res.status(400).json({ success: false, error: error });
      }
    default:
      res.status(400).json({ success: false });
      break;
  }
};
