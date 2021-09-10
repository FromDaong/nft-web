import dbConnect from "../../../../utils/dbConnect";
import Model from "../../../../models/Model";
import NFT from "../../../../models/NFT";

dbConnect();

export default async (req, res) => {
  const {
    query: { address },
    method,
  } = req;

  switch (method) {
    case "GET":
      try {
        let modelRes = await Model.findOne({ address });

        if (!modelRes) return res.status(200);

        const modelNFTs = await Promise.all(
          modelRes.sub_nfts.map(async (n) => {
            return await NFT.findOne({ id: n.id });
          })
        );

        const returnData = { nfts: modelNFTs };

        res.status(200).json(returnData);
      } catch (error) {
        console.log({ error });
        res.status(400).json({ success: false, error: error });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
};
