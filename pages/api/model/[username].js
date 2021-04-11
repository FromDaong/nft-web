import dbConnect from "../../../utils/dbConnect";
import Model from "../../../models/Model";
import Web3 from "web3";
import TreatNFTMinterAbi from "../../../treat/lib/abi/treatnftminter.json";

dbConnect();

const web3 = new Web3("https://bsc-dataseed2.defibit.io");

const treatNFTMinter = new web3.eth.Contract(
  TreatNFTMinterAbi,
  "0xde39d0b9a93dcd541c24e80c8361f362aab0f213"
);

export default async (req, res) => {
  const {
    query: { username },
    method,
  } = req;

  switch (method) {
    case "GET":
      try {
        let modelRes = await Model.findOne({ username });

        if (!modelRes)
          return res
            .status(400)
            .json({ success: false, error: "model not found" });

        const returnData = { ...modelRes.toObject() };
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
        let modelRes = await Model.findOne({ username });

        if (!modelRes) {
          res.status(404);
          return;
        }

        // const prev = modelRes.mints.find((e) => e.buyer === mint.account);
        const mint = req.body.mint;
        console.log({ mint });

        const balance = await treatNFTMinter.methods
          .balanceOf(mint.buyer, mint.nftId)
          .call();

        if (balance > 1) {
          await Model.updateOne(
            { username },
            {
              $push: { mints: mint },
            }
          );

          res.status(200).json({ success: true });
        } else {
          res
            .status(400)
            .json({ success: false, error: "you don't own this model" });
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
