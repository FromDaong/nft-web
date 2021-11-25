import dbConnect from "../../../utils/dbConnect";
import { mapNftBody } from "./mappers";
import NFT from "../../../models/NFT";
import Model from "../../../models/Model";
import Web3 from "web3";
import { getBalanceNumber } from "../../../utils/formatBalance";
import TreatNFTMinterAbi from "../../../treat/lib/abi/treatnftminter.json";
import TreatMarketplaceAbi from "../../../treat/lib/abi/treatMarketplace.json";
import { getNftMaxSupply, getNftTotalSupply } from "../../../treat/utils";
import { contractAddresses } from "../../../treat/lib/constants";

dbConnect();

const web3 = new Web3("https://bsc-dataseed2.defibit.io/");

const treatNFTMinter = new web3.eth.Contract(
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
        let NFTres = await NFT.findOne({ id: Number(id) });

        if (!NFTres)
          return res
            .status(400)
            .json({ success: false, error: "nft not found" });

        // console.log("call api", id);
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

        if (returnData.blurhash) delete returnData.image;

        res.status(200).json(returnData);
      } catch (error) {
        console.log({ error });
        res.status(400).json({ success: false, error: error });
      }
      break;

    case "PUT":
      try {
        let NFTres = await NFT.findOne({ id: Number(id) });

        if (!NFTres) {
          res.status(404);
          return;
        }

        // const prev = NFTres.mints.find((e) => e.buyer === mint.account);
        const mint = req.body.mint;
        console.log({ mint });

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
        console.log({ error });
        res.status(400).json({ success: false, error: error });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
};
