import dbConnect from "../../../../utils/dbConnect";
import Model from "../../../../models/Model";
import NFT from "../../../../models/NFT";

dbConnect();

export default async (req, res) => {
  const {
    query: { username },
    method,
  } = req;

  switch (method) {
    case "GET":
      try {
        let modelRes = await Model.findOne({
          username,
        });

        if (!modelRes) return res.status(200);

        const modelNFTs = await Promise.all(
          modelRes.nfts.map(async (nft) => {
            const n = await NFT.findOne({ id: +nft.id });
            if (!n) {
              
              return;
            }
            const returnObj = { ...n.toObject() };

            returnObj.mints = returnObj.mints.length;
            delete returnObj.model_bnb_address;

            if (returnObj.blurhash) delete returnObj.image;

            return returnObj;
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
