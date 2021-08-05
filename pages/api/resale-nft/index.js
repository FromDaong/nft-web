import dbConnect from "../../../utils/dbConnect";
import NFT from "../../../models/NFT";
import ResaleNFT from "../../../models/ResaleNFT";
import Web3 from "web3";
import BigNumber from "bignumber.js";
import { getOpenOrdersForSeller } from "../../../treat/utils";
import TreatNFTMinterAbi from "../../../treat/lib/abi/treatnftminter.json";
import TreatMarketplaceAbi from "../../../treat/lib/abi/treatMarketplace.json";
import { contractAddresses } from "../../../treat/lib/constants";

const web3 = new Web3("https://bsc-dataseed2.defibit.io");

const treatNFTMinter = new web3.eth.Contract(
  TreatNFTMinterAbi,
  contractAddresses.treatNFTMinter[56]
);

const treatMarketplace = new web3.eth.Contract(
  TreatMarketplaceAbi,
  contractAddresses.treatMarketplace[56]
);
dbConnect();

export default async (req, res) => {
  const { method } = req;

  switch (method) {
    case "GET":
      try {
        const NFTs = await NFT.find();

        const returnNFTs = await NFTs.map((n) => {
          const returnObj = { ...n.toObject() };

          delete returnObj.model_bnb_address;
          delete returnObj.image;

          return returnObj;
        });

        res.status(200).json(returnNFTs);
      } catch (error) {
        console.log({ error });
        res.status(400).json({ success: false, error: error });
      }
      break;

    // For updating database if user adds NFT listing to marketplace.
    // case "POST":
    //   try {
    //     const { seller } = req.body;

    //     const openOrders = await getOpenOrdersForSeller(
    //       treatMarketplace,
    //       seller
    //     );

    //     console.log({ openOrders, seller });

    //     // const NFTs = await NFT.find();

    //     const listedResalesByUser = await ResaleNFT.find({
    //       seller,
    //     });

    //     let newOpenOrders = [...openOrders];

    //     // Compare existing resales in database to all resales on blockchain
    //     let results = listedResalesByUser.map((i) => {
    //       const index = newOpenOrders.findIndex((o) => o.nft_id === i);
    //       newOpenOrders.splice(index, 1);
    //     });

    //     // If there's extra in blockchain that aren't in the database, add them
    //     newOpenOrders.map(() => {
    //       const newNFT = await NFT.create(nftBody);
    //     });

    //     // let results = await Promise.all(
    //     //   NFTs.map(async (n) => {
    //     //     console.log(n.id);
    //     //     const balance = await treatNFTMinter.methods
    //     //       .balanceOf(seller, n.id)
    //     //       .call();

    //     //     const bigNumberBalance = new BigNumber(balance);
    //     //     const numberBalance = bigNumberBalance.toNumber();

    //     //     console.log({ numberBalance });

    //     //     const nftData = await NFT.findOne({ id: Number(id) });

    //     //     const hasOpenOrder =
    //     //       !!openOrders && !!openOrders.find((o) => o === id);

    //     //     if (numberBalance > 0 || hasOpenOrder) {
    //     //       return {
    //     //         ...nftData.toObject(),
    //     //         balance: numberBalance,
    //     //         hasOpenOrder: hasOpenOrder,
    //     //       };
    //     //     } else {
    //     //       return undefined;
    //     //     }
    //     //   })
    //     // );

    //     results = results.filter((e) => e);

    //     console.log({ results });

    //     // res.status(200).json({ success: true, results });
    //   } catch (error) {
    //     console.log({ error });
    //     res.status(400).json({ success: false, error: error });
    //   }
    //   break;
    default:
      res.status(400).json({ success: false });
      break;
  }
};
