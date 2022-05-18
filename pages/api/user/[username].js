import Model from "../../../db/models/Model";
import TreatNFTMinterAbi from "../../../treat/lib/abi/treatnftminter.json";
import Web3 from "web3";
import dbConnect from "../../../utils/dbConnect";

dbConnect();

const web3 = new Web3(
  "https://speedy-nodes-nyc.moralis.io/0e4b710bbd818e9709fe0ef5/bsc/mainnet"
);

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
        delete returnData.email;
        if (returnData.blurhash) delete returnData.image;

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
