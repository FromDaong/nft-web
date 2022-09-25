import Model from "../../../../../db/models/Model";
import NFT from "../../../../../db/models/NFT";
import dbConnect from "../../../../../utils/dbConnect";

dbConnect();

export default async function autocomplete(req, res) {
  const { s } = req.query;
  const { group } = req.query;

  try {
    if (!s) {
      return res.json([]);
    }

    const nfts = await NFT.aggregate([
      {
        $search: {
          autocomplete: {
            // index: "nfts_autocomplete",
            query: s,
            path: "name",
            fuzzy: {
              maxEdits: 2,
              prefixLength: 3,
            },
          },
        },
      },
    ]);
    const models = await Model.aggregate([
      {
        $search: {
          autocomplete: {
            //index: "models_autocomplete",
            query: s,
            path: "username",
            fuzzy: {
              maxEdits: 2,
              prefixLength: 3,
            },
          },
        },
      },
    ]);

    const streaming_models = await Model.aggregate([
      {
        $search: {
          autocomplete: {
            //index: "models_autocomplete",
            query: s,
            path: "username",
            fuzzy: {
              maxEdits: 2,
              prefixLength: 3,
            },
          },
        },
      },
      {
        $match: {
          livestream_active: true,
        },
      },
    ]);

    if (group) {
      switch (group) {
        case "nfts":
          return res.json(nfts);
        case "models":
          return res.json(models);
        case "streaming":
          return res.json(streaming_models);
        default:
          return res.json([]);
      }
    }

    return res.json([
      ...nfts.map((nft) => ({ ...nft, group: "nft" })),
      ...models.map((model) => ({ ...model, group: "model" })),
      ...streaming_models.map((model) => ({ ...model, group: "streaming" })),
    ]);
  } catch (error) {
    console.error({ error });
    res.status(400).json({ success: false, error: error });
  }
}
