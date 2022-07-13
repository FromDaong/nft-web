import BigNumber from "bignumber.js";
import NFT from "../../../db/models/NFT";
import Web3 from "web3";
import { contractAddresses } from "../../../treat/lib/constants";
import dbConnect from "../../../utils/dbConnect";
import { getOpenOrdersForSeller } from "../../../treat/utils";
// import TreatNFTMinterAbi from "../../../treat/lib/abi/treatnftminterv1.json";
import treatmart from "../../../treat/lib/abi/treatmart.json";

const web3 = new Web3(
  "https://nd-421-513-967.p2pify.com/4b6934a4a6a6ace1d6ba8644eae82d6e"
);

const treatNFTMart = new web3.eth.Contract(
  treatmart,
  contractAddresses.treatMart[56]
);

// const treatMarketplace = new web3.eth.Contract(
//   TreatMarketplaceAbi,
//   contractAddresses.treatMarketplace[56]
// );

dbConnect();

export default async (req, res) => {
  const { method } = req;

  switch (method) {
    case "GET":
      try {
        const NFTs = await NFT.find();

        let results = await Promise.all(
          NFTs.map(async (nft) => {
            const balance = await treatNFTMart.methods
              .treatModels(nft.id)
              .call();

            return { id: nft.id, address: balance };

            // const bigNumberBalance = new BigNumber(balance);
            // const numberBalance = bigNumberBalance.toNumber();

            // const nftData = await NFT.findOne({ id: Number(id) });

            // const hasOpenOrder =
            //   !!openOrders && !!openOrders.find((o) => o === id);

            // if (numberBalance > 0 || hasOpenOrder) {
            //   return {
            //     ...nftData.toObject(),
            //     balance: numberBalance,
            //     hasOpenOrder: hasOpenOrder,
            //   };
            // } else {
            //   return undefined;
            // }
          })
        );

        const returnResults = results
          .sort((a, b) => a.id - b.id)
          .map((a) => a.address);

        // results = results.filter((e) => e);

        res.status(200).json(returnResults);
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
