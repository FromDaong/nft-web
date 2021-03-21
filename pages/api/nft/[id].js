import dbConnect from "../../../utils/dbConnect";
import { mapNftBody } from "./mappers";
import NFT from "../../../models/NFT";
import Web3 from "web3";
import TreatNFTMinterAbi from "../../../treat/lib/abi/treatnftminter.json";

dbConnect();

const web3 = new Web3("https://bsc-dataseed.binance.org/");

const treatNFTMinter = new web3.eth.Contract(
  TreatNFTMinterAbi,
  "0xde39d0b9a93dcd541c24e80c8361f362aab0f213"
);

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
        let NFTres = await NFT.findOne({ id: Number(id) });

        if (!NFTres) {
          res.status(404);
          return;
        }

        // const prev = NFTres.mints.find((e) => e.buyer === mint.account);
        const mint = req.body.mint;
        console.log({ mint });

        const balance = await treatNFTMinter.methods
          .balanceOf(mint.buyer, mint.nftId)
          .call();

        if (balance > 1) {
          await NFT.updateOne(
            { id: Number(id) },
            {
              $push: { mints: mint },
            }
          );

          res.status(200).json({ success: true });
        } else {
          res
            .status(400)
            .json({ success: false, error: "you don't own this nft" });
        }
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
