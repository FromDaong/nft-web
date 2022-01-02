import dbConnect from "../../../../utils/dbConnect";
import NFT from "../../../../models/NFT";
import Web3 from "web3";
import TreatNFTMinterAbi from "../../../../treat/lib/abi/treatnftminter.json";

dbConnect();

const web3 = new Web3(
  "https://divine-restless-feather.bsc.quiknode.pro/f9ead03ddd05508e4fe1f6952eea26ac035c8408/"
);

export default async (req, res) => {
  const {
    query: { id },
    method,
  } = req;

  switch (method) {
    case "GET":
      try {
        let nftRes = await NFT.findOne({
          id: id,
        });

        if (!nftRes) return res.json({});

        const returnData = { ...nftRes.toObject() };

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
