import dbConnect from "../../../utils/dbConnect";
import NFT from "../../../models/NFT";
// import User from "../../../../models/User";
import withSession from "../../../lib/session";

dbConnect();

export default async (req, res) => {
  const { method } = req;

  switch (method) {
    case "GET":
      try {
        const NFTs = await NFT.find();

        const returnNFTs = await NFTs.map((n) => {
          const returnObj = { ...n.toObject() };

          returnObj.mints = returnObj.mints.length;
          delete returnObj.model_bnb_address;
          delete returnObj.image;

          return returnObj;
        });

        res.status(200).json(returnNFTs);
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
