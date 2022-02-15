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

        if (s) {
          const aggregate = Model.aggregate([
            {
              $search: {
                index: "init",
                text: {
                  query: `${s}*`,
                  path: ["username", "bio", "display_name"],
                },
              },
            },
          ]);
          Models = await Model.aggregatePaginate(aggregate, options);
        } else if (req.query.totm) {
          Models = await Model.find();
          Models.docs = Models;
          // return only docs with totm
          Models.docs = Models.docs.filter(
            (model) => model.totm && model.nfts.length > 0
          );
        } else {
          Models = await Model.paginate({}, options);
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
