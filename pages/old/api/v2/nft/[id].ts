import { getNftMaxSupply, getNftTotalSupply } from "../../../../../treat/utils";

import NFT from "../../../../../db/models/NFT";
import TreatNFTMinterAbi from "../../../../../treat/lib/abi/treatnftminter.json";
import Web3 from "web3";
import { contractAddresses } from "../../../../../treat/lib/constants";
import dbConnect from "../../../../../utils/dbConnect";

dbConnect();

const web3 = new Web3(
  "https://nd-421-513-967.p2pify.com/4b6934a4a6a6ace1d6ba8644eae82d6e"
);

const treatNFTMinter = new web3.eth.Contract(
  // @ts-ignore
  TreatNFTMinterAbi,
  contractAddresses.treatNFTMinter[56]
);

export default async (req, res) => {
  const {
    query: { id },
    method,
  } = req;

  switch (method) {
    case "GET":
      try {
        const NFTres = await NFT.findOne({ id: Number(id) });

        if (!NFTres)
          return res
            .status(400)
            .json({ success: false, error: "nft not found" });

        // it's safe to use .toNumber on these BigNumbers here because supply should always be in a valid int32 range
        const maxSupply = (
          await getNftMaxSupply(treatNFTMinter, id)
        )?.toNumber();
        const totalSupply = (
          await getNftTotalSupply(treatNFTMinter, id)
        )?.toNumber();

        const returnData = {
          ...NFTres.toObject(),
          maxSupply,
          totalSupply,
        };

        if (returnData.blurhash) {
          delete returnData.image;
          delete returnData.cdnUrl;
        }

        res.status(200).json(returnData);
      } catch (error) {
        console.error({ error });
        res.status(400).json({ success: false, error: error });
      }
      break;

    case "PUT":
      try {
        const NFTres = await NFT.findOne({ id: Number(id) });

        if (!NFTres) {
          res.status(404);
          return;
        }

        // const prev = NFTres.mints.find((e) => e.buyer === mint.account);
        const mint = req.body.mint;

        const balance = await treatNFTMinter.methods
          .balanceOf(mint.buyer, mint.nftId)
          .call();

        if (balance > 1) {
          await NFT.updateOne(
            { id: Number(id) },
            {
              $push: { mints: mint },
            }
          );

          res.status(200).json({ success: true });
        } else {
          res
            .status(400)
            .json({ success: false, error: "you don't own this nft" });
        }
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