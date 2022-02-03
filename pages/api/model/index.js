import dbConnect from "../../../utils/dbConnect";
import Model from "../../../models/Model";

dbConnect();

export default async (req, res) => {
  const { method } = req;

  switch (method) {
    case "GET":
      try {
        const options = {
          page: req.query.page ?? 1,
          limit: 24,
          collation: {
            locale: "en",
          },
        };
        const Models = await Model.paginate({}, options);
        console.log({ Models });
        // if (model.pending || model.rejected || model.hidden) return undefined;

        Models.docs = await Models.docs.sort(
          (a, b) =>
            b.nfts.length +
            b.sub_nfts.length -
            (a.nfts.length + a.sub_nfts.length)
        );

        res.status(200).json(Models);
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
