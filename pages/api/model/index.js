import dbConnect from "../../../utils/dbConnect";
import Model from "../../../models/Model";

dbConnect();

export default async (req, res) => {
  const { method } = req;
  const { s } = req.query;

  switch (method) {
    case "GET":
      try {
        const options = {
          page: req.query.p ?? 1,
          limit: 24,
          collation: {
            locale: "en",
          },
        };

        let Models;

        if (!s) {
          Models = await Model.paginate({}, options);
          // if (model.pending || model.rejected || model.hidden) return undefined;
        } else {
          const aggregate = Model.aggregate([
            {
              $search: {
                text: {
                  query: `${s}*`,
                  path: ["username", "bio", "display_name"],
                },
              },
            },
          ]);
          Models = await Model.aggregatePaginate(aggregate, options);
        }

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
