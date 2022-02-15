import dbConnect from "../../../utils/dbConnect";
import Model from "../../../models/Model";
import Web3 from "web3";
import TreatNFTMinterAbi from "../../../treat/lib/abi/treatnftminter.json";

dbConnect();

const web3 = new Web3(
  "https://divine-restless-feather.bsc.quiknode.pro/f9ead03ddd05508e4fe1f6952eea26ac035c8408/"
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
