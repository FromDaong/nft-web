import Model from "../../../../models/Model";
import NFT from "../../../../models/NFT";

export default async function autocomplete(req, res) {
  const { s } = req.query;
  const { group } = req.query;

  if (!s) {
    return res.json([]);
  }

  const nfts = await NFT.aggregate([
    {
      $search: {
        autocomplete: {
          query: s,
          path: ["name", "description", "model_handle"],
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
          query: s,
          path: ["username", "bio", "display_name"],
          fuzzy: {
            maxEdits: 2,
            prefixLength: 3,
          },
        },
      },
    },
  ]);

  if (group) {
    switch (group) {
      case "nfts":
        return res.json(nfts);
      case "models":
        return res.json(models);
      default:
        return res.json([]);
    }
  }

  return res.json([
    ...nfts.map((nft) => ({ ...nft, group: "nft" })),
    ...models.map((model) => ({ ...model, group: "model" })),
  ]);
}
