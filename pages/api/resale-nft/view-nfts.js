import dbConnect from "../../../utils/dbConnect";
import NFT from "../../../models/NFT";
import BigNumber from "bignumber.js";
import Web3 from "web3";
import TreatNFTMinterAbi from "../../../treat/lib/abi/treatnftminter.json";
import TreatMarketplaceAbi from "../../../treat/lib/abi/treatMarketplace.json";
import { contractAddresses } from "../../../treat/lib/constants";
import { getOpenOrdersForSeller } from "../../../treat/utils";

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
    case "POST":
      try {
        const { nft_ids, signature } = req.body;

        const signer = web3.eth.accounts.recover("Reveal Contents", signature);

        const openOrders = await getOpenOrdersForSeller(
          treatMarketplace,
          signer
        );

        let results = await Promise.all(
          nft_ids.map(async (id) => {
            const balance = await treatNFTMinter.methods
              .balanceOf(signer, id)
              .call();

            const bigNumberBalance = new BigNumber(balance);
            const numberBalance = bigNumberBalance.toNumber();

            const nftData = await NFT.findOne({ id: Number(id) });

            const hasOpenOrder =
              !!openOrders && !!openOrders.find((o) => o === id);

            if (numberBalance > 0 || hasOpenOrder) {
              return {
                ...nftData.toObject(),
                balance: numberBalance,
                hasOpenOrder: hasOpenOrder,
              };
            } else {
              return undefined;
            }
          })
        );

        results = results.filter((e) => e);

        res.status(200).json({ success: true, results });
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
