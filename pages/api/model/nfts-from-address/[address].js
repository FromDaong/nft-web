import Model from "../../../../db/models/Model";
import NFT from "../../../../db/models/NFT";
import dbConnect from "../../../../utils/dbConnect";

dbConnect();

export default async (req, res) => {
  const {
    query: { address },
    method,
  } = req;

  switch (method) {
    case "GET":
      try {
        let modelRes = await Model.findOne({
          address: `${address}`.toLowerCase(),
        });

        if (!modelRes) return res.status(200);

        const modelNFTs = await Promise.all(
          modelRes.nfts.map(async (n) => {
            return await NFT.findOne({ id: n.id });
          })
        );

        const returnData = { nfts: modelNFTs };

        res.status(200).json(returnData);
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
