import dbConnect from "../../../utils/dbConnect";
import mapNftBody from "./mappers";
import NFT from "../../../models/NFT";
// import User from "../../../../models/User";
import withSession from "../../../lib/session";

dbConnect();

export default async (req, res) => {
  const {
    query: { id },
    method,
  } = req;

  switch (method) {
    case "GET":
      try {
        console.log({ id });
        let NFTs = await NFT.findOne({ id: Number(id) });

        if (!NFTs)
          return res
            .status(400)
            .json({ success: false, error: "nft not found" });

        res.status(200).json(NFTs);
      } catch (error) {
        res.status(400).json({ success: false, error: error });
      }
      break;
    case "PUT":
      try {
        const nft = mapNftBody(req.body);
        await NFT.updateOne(
          { id: nft.id },
          {
            $set: { mints: nft.mints },
          }
        );

        res.status(200).json({success: true})

      } catch (error) {
        res.status(400).json({ success: false, error: error });
      }
    default:
      res.status(400).json({ success: false });
      break;
  }
};
