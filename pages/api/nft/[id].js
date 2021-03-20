import dbConnect from "../../../utils/dbConnect";
import { mapNftBody } from "./mappers";
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
        let NFTres = await NFT.findOne({ id: Number(id) });

        if (!NFTres)
          return res
            .status(400)
            .json({ success: false, error: "nft not found" });

        const returnData = { ...NFTres.toObject() };
        delete returnData.model_bnb_address;
        delete returnData.image;

        res.status(200).json(returnData);
      } catch (error) {
        console.log({ error });
        res.status(400).json({ success: false, error: error });
      }
      break;

    case "PUT":
      try {
        const mint = req.body.mint;

        await NFT.updateOne(
          { id },
          {
            $push: { mints: mint },
          }
        );

        res.status(200).json({ success: true });
      } catch (error) {
        res.status(400).json({ success: false, error: error });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
};
