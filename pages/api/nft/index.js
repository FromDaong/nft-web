import dbConnect from "../../../utils/dbConnect";
import NFT from "../../../models/NFT";
import * as atob from "atob";

// import User from "../../../../models/User";
dbConnect();

export default async (req, res) => {
  const { method } = req;
  const { s } = req.query;

  switch (method) {
    case "GET":
      try {
        if (req.query.all) {
          let NFTs = await NFT.find();
          NFTs = await NFTs.map((n) => {
            const returnObj = { ...n.toObject() };

            returnObj.mints = returnObj.mints.length;
            delete returnObj.identity_access_key;

            if (returnObj.blurhash) {
              delete returnObj.image;
              delete returnObj.daoCdnUrl;
            }
            return returnObj;
          });
          return res.status(200).json(NFTs);
        }

        const options = {
          page: req.query.p ?? 1,
          limit: 24,
          collation: {
            locale: "en",
          },
          sort: {},
        };
        const { tags, sort } = req.query;
        let filterTags = [];

        if (tags) {
          filterTags = atob(tags).split(",");
        }

        let NFTs;
        if (sort) {
          switch (sort) {
            case "recent":
              options.sort.id = -1;
              break;
            case "desc":
              options.sort.list_price = -1;
              break;
            case "asc":
              options.sort.list_price = 1;
              break;
            default:
              options.sort.id = -1;
              break;
          }
        } else {
          options.sort.id = -1;
        }

        if (s) {
          const agg = [
            {
              $search: {
                index: "init",
                wildcard: {
                  query: `${s}*`,
                  path: ["name", "description", "model_handle"],
                  allowAnalyzedField: true,
                },
              },
            },
            {
              $match: {
                old_totw: { $exists: false },
                old_totm: { $exists: false },
                melon_nft: { $exists: false },
                subscription_nft: { $exists: false },
                ...(filterTags.length > 0 && { tags: { $in: filterTags } }),
              },
            },
          ];
          const aggregate = NFT.aggregate(agg);
          NFTs = await NFT.aggregatePaginate(aggregate, options);
        } else {
          const query = {
            old_totw: { $exists: false },
            old_totm: { $exists: false },
            melon_nft: { $exists: false },
            subscription_nft: { $exists: false },
          };

          if (filterTags.length > 0) {
            query.tags = {
              $in: filterTags,
            };
          }
          NFTs = await NFT.paginate(query, options);
        }

        NFTs.docs = await NFTs.docs.map((n) => {
          const returnObj = { ...(n.toObject ? n.toObject() : n) };

          returnObj.mints = returnObj.mints?.length;
          delete returnObj.identity_access_key;

          if (returnObj.blurhash) {
            delete returnObj.image;
            delete returnObj.daoCdnUrl;
          }

          return returnObj;
        });
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
