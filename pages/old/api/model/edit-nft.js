import Model from "../../../db/models/Model";
import NFT from "../../../db/models/NFT";
import TreatNFTMinterAbi from "../../../treat/lib/abi/treatnftminter.json";
import Web3 from "web3";
import { contractAddresses } from "../../../treat/lib/constants";
import dbConnect from "../../../utils/dbConnect";
import withSession from "../../../lib/session";

dbConnect();

const web3 = new Web3(
  "https://nd-421-513-967.p2pify.com/4b6934a4a6a6ace1d6ba8644eae82d6e"
);

const treatNFTMinter = new web3.eth.Contract(
  TreatNFTMinterAbi,
  contractAddresses.treatNFTMinter[56]
);

export default withSession(async (req, res) => {
  const { method } = req;

  switch (method) {
    case "POST":
      try {
        if (!req.body.address || !req.body.id)
          return res
            .status(400)
            .json({ success: false, error: "missing params" });

        const isPerformer = await treatNFTMinter.methods
          .isPerformer(req.body.address)
          .call();

        if (!isPerformer)
          return res
            .status(400)
            .json({ success: false, error: "no permission" });

        const nft = await NFT.findOne({ id: req.body.id });
        nft.name = req.body.name;
        nft.list_price = req.body.list_price;
        nft.description = req.body.description;
        nft.tags = req.body.tags;
        nft.blurhash = req.body.blurhash;

        await nft.save();

        res.status(200).json({ success: true, nft });
      } catch (error) {
        console.error({ error });
        res.status(400).json({ success: false, error: error });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
});
