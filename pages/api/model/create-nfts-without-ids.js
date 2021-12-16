import dbConnect from "../../../utils/dbConnect";
import PendingNFT from "../../../models/PendingNFT";
import Model from "../../../models/Model";
import withSession from "../../../lib/session";
import { contractAddresses } from "../../../treat/lib/constants";
import TreatNFTMinterAbi from "../../../treat/lib/abi/treatnftminter.json";
import Web3 from "web3";

dbConnect();

const web3 = new Web3(
  "https://divine-restless-feather.bsc.quiknode.pro/f9ead03ddd05508e4fe1f6952eea26ac035c8408/"
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
        if (!req.body.address || !req.body.nfts)
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

        const newNFTs = await Promise.all(
          req.body.nfts.map((nft) => {
            return new Promise(async (resolve, reject) => {
              const nftBody = {
                tx_hash: nft.tx_hash,
                list_price: nft.list_price,
                name: nft.name,
                description: nft.description,
                external_url: nft.external_url,
                image: nft.image,
                model_handle: nft.model_handle,
                max_supply: nft.max_supply,
                model_bnb_address: nft.model_bnb_address,
                blurhash: nft.blurhash,
                model_profile_pic: nft.model_profile_pic,
                attributes: [
                  {
                    trait_type: "Model",
                    value: nft.model_handle,
                  },
                  {
                    trait_type: "Max Supply",
                    value: nft.max_supply,
                  },
                ],
              };

              try {
                const newNFT = await PendingNFT.create(nftBody);
                console.log("NEW NFT CREATED");
                resolve(newNFT);
              } catch (e) {
                console.log("NEW NFT ERRORED");
                reject(e);
              }
            });
          })
        );

        console.log("New NFT", newNFTs);

        res.status(200).json({ success: true, newNFTs });
      } catch (error) {
        console.log({ error });
        res.status(400).json({ success: false, error: error });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
});
