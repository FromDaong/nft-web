import dbConnect from "../../../utils/dbConnect";
import Model from "../../../models/Model";

dbConnect();

export default async (req, res) => {
  const { method } = req;

  switch (method) {
    case "GET":
      try {
        const Models = await Model.find({ subscription: { $exists: true } });

        const returnModels = await Models.map((n) => {
          const returnObj = { ...n.toObject() };
          delete returnObj.email;
          return returnObj;
        });

        const sortedModels = await returnModels.sort(
          (a, b) =>
            b.nfts.length +
            b.sub_nfts.length -
            (a.nfts.length + a.sub_nfts.length)
        );

        res.status(200).json(sortedModels);
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
