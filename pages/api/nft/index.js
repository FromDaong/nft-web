import dbConnect from "../../../utils/dbConnect";
import NFT from "../../../models/NFT";
// import User from "../../../../models/User";
import withSession from "../../../lib/session";

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
          sort: {
            list_price: -1,
            id: -1,
          },
        };
        const sort = req.query.sort;

        let NFTs;

        console.log({ sort, options });

        if (s) {
          const aggregate = NFT.aggregate([
            {
              $search: {
                index: "init",
                text: {
                  query: `${s}*`,
                  path: ["name", "description", "model_handle"],
                },
              },
            },
          ]);
          NFTs = await NFT.aggregatePaginate(aggregate, options);
        } else {
          NFTs = await NFT.paginate(
            {
              cdnUrl: { $exists: true },
            },
            options
          );
        }

        return res.status(200).json(NFTs);
      } catch (error) {
        console.error({ error });
        res
          .status(400)
          .json({ success: false, error: error, db: process.env.MONGO_URL });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
};
