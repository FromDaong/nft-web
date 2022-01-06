import dbConnect from "../../../utils/dbConnect";
import Model from "../../../models/Model";
// import User from "../../../../models/User";
import withSession from "../../../lib/session";

dbConnect();

export default async (req, res) => {
  const { method } = req;

  switch (method) {
    case "GET":
      try {
        const Models = await Model.find();

        const returnModels = await Models.map((n) => {
          const returnObj = { ...n.toObject() };

          return returnObj;
        });

        res.status(200).json(returnModels);
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
