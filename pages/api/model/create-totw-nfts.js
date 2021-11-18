import dbConnect from "../../../utils/dbConnect";
import NFT from "../../../models/NFT";
import Model from "../../../models/Model";
import withSession from "../../../lib/session";
import { contractAddresses } from "../../../treat/lib/constants";
import TreatNFTMinterAbi from "../../../treat/lib/abi/treatnftminter.json";
import Web3 from "web3";

dbConnect();

const web3 = new Web3("https://data-seed-prebsc-1-s1.binance.org:8545/");

const treatNFTMinter = new web3.eth.Contract(
  TreatNFTMinterAbi,
  contractAddresses.treatNFTMinter[97]
);

export default withSession(async (req, res) => {
  const { method } = req;

  switch (method) {
    case "POST":
      try {
        const user = await req.session.get("admin");

        if (!req.body.address || !req.body.nfts || !user)
          return res
            .status(400)
            .json({ success: false, error: "missing params" });

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
                totw: true,
                old_totw: true,
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
                      nfts: {
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

        console.log("New NFT", newNFTs);

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
