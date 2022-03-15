import dbConnect from "../../../../utils/dbConnect";
import NFT from "../../../../models/NFT";
import Web3 from "web3";
import TreatNFTMinterAbi from "../../../../treat/lib/abi/treatnftminter.json";

dbConnect();

const web3 = new Web3(
  "https://speedy-nodes-nyc.moralis.io/0e4b710bbd818e9709fe0ef5/bsc/mainnet
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
