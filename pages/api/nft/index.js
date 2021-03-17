import dbConnect from "../../../utils/dbConnect";
import NFT from "../../../models/NFT";
// import User from "../../../../models/User";
import withSession from "../../../lib/session";

dbConnect();

export default (async (req, res) => {
  const { method } = req;

  switch (method) {
    case "GET":
      try {
        let NFTs = await NFT.find();

        res.status(200).json(NFTs);
      } catch (error) {
        res.status(400).json({ success: false, error: error });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
});