import NFT from "../../../../db/models/NFT";
import TreatNFTMinterAbi from "../../../../treat/lib/abi/treatnftminter.json";
import Web3 from "web3";
import dbConnect from "../../../../utils/dbConnect";

dbConnect();

const web3 = new Web3(
  "https://nd-421-513-967.p2pify.com/4b6934a4a6a6ace1d6ba8644eae82d6e"
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
