import dbConnect from "../../../utils/dbConnect";
import NFT from "../../../models/NFT";
import BigNumber from "bignumber.js";
import Web3 from "web3";
// import TreatNFTMinterAbi from "../../../treat/lib/abi/treatnftminterv1.json";
import treatmart from "../../../treat/lib/abi/treatmart.json";
import { contractAddresses } from "../../../treat/lib/constants";
import { getOpenOrdersForSeller } from "../../../treat/utils";

const web3 = new Web3(
  "https://divine-restless-feather.bsc.quiknode.pro/f9ead03ddd05508e4fe1f6952eea26ac035c8408/"
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
        console.log({ error });
        res.status(400).json({ success: false, error: error });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
};
