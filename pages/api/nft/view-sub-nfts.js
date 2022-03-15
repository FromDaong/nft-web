import {
  getTreatSubscriptionContract,
  isSubscribed,
} from "../../../treat/utils";

import BigNumber from "bignumber.js";
import NFT from "../../../models/NFT";
import TreatNFTMinterAbi from "../../../treat/lib/abi/treatnftminter.json";
import TreatSubscriptionsAbi from "../../../treat/lib/abi/treatsubscriptions.json";
import Web3 from "web3";
import { contractAddresses } from "../../../treat/lib/constants";
import dbConnect from "../../../utils/dbConnect";

const web3 = new Web3(
  "https://speedy-nodes-nyc.moralis.io/0e4b710bbd818e9709fe0ef5/bsc/mainnet"
);

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

            if (isSignerSubscribed) {
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
        console.error({ error });
        res.status(400).json({ success: false, error: error });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
};
