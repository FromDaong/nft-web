import Model from "../../../../models/Model";
import dbConnect from "../../../../utils/dbConnect";

dbConnect();

export default async (req, res) => {
  const { method } = req;
  const { s, p } = req.query;

  switch (method) {
    case "GET":
      try {
        const options = {
          page: p ?? 1,
          limit: 24,
          collation: {
            locale: "en",
          },
        };

        let Models;

        if (!s) {
          // @ts-ignore
          Models = await Model.paginate({ livestream_active: true }, options);
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
                livestream_active: true,
              },
            },
          ]);
          // @ts-ignore
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
