import Model from "../../../db/models/Model";
import dbConnect from "../../../utils/dbConnect";

dbConnect();

const model = async (req, res) => {
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
          Models = await Model.find({ totm: true });
          // return only docs with totm
          Models = Models.find((model) => model.totm) ?? {};
        } else {
          Models = await Model.paginate({}, options);
        }

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

export default model;