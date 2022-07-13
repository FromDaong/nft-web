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
                id: Number(nft.id),
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
                subscription_nft: true,
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
                const newNFT = await NFT.create(nftBody);
                await Model.updateOne(
                  { address: nft.model_bnb_address },
                  {
                    $push: {
                      sub_nfts: {
                        id: nft.id,
                      },
                    },
                  },
                  {
                    _id: false,
                  }
                );
                resolve(newNFT);
              } catch (e) {
                reject(e);
              }
            });
          })
        );

        res.status(200).json({ success: true, newNFTs });
      } catch (error) {
        res.status(400).json({ success: false, error: error });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
});
