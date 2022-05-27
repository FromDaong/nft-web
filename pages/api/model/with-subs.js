import Model from "../../../db/models/Model";
import dbConnect from "../../../utils/dbConnect";

dbConnect();

export default async (req, res) => {
  const { method } = req;

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
        const { s } = req.query;

        if (!req.query.s) {
          Models = await Model.paginate(
            { subscription: { $exists: true } },
            options
          );
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
            {
              $match: {
                subscription: { $exists: true },
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
