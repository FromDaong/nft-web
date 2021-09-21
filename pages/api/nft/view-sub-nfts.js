import dbConnect from "../../../utils/dbConnect";
import NFT from "../../../models/NFT";
import BigNumber from "bignumber.js";
import Web3 from "web3";
import TreatNFTMinterAbi from "../../../treat/lib/abi/treatnftminter.json";
import TreatSubscriptionsAbi from "../../../treat/lib/abi/treatsubscriptions.json";
import { contractAddresses } from "../../../treat/lib/constants";
import {
  isSubscribed,
  getTreatSubscriptionContract,
} from "../../../treat/utils";

const web3 = new Web3("https://bsc-dataseed2.defibit.io");

const treatNFTMinter = new web3.eth.Contract(
  TreatNFTMinterAbi,
  contractAddresses.treatNFTMinter[56]
);

const treatSubscriptionContract = new web3.eth.Contract(
  TreatSubscriptionsAbi,
  contractAddresses.treatSubscriptions[56]
);

dbConnect();

export default async (req, res) => {
  const { method } = req;

  switch (method) {
    case "POST":
      try {
        const { nft_ids, signature } = req.body;

        const signer = web3.eth.accounts.recover("Reveal Contents", signature);

        let results = await Promise.all(
          nft_ids.map(async (id) => {
            if (!id) return undefined;

            const nftData = await NFT.findOne({ id: Number(id) });
            const isSignerSubscribed = await isSubscribed(
              treatSubscriptionContract,
              signer,
              nftData.model_bnb_address
            );

            console.log({ isSignerSubscribed });

            if (isSignerSubscribed) {
              console.log({ nftData });
              return {
                ...nftData.toObject(),
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
