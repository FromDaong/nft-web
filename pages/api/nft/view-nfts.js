import dbConnect from "../../../utils/dbConnect";
import NFT from "../../../models/NFT";
import BigNumber from "bignumber.js";
import Web3 from "web3";
import TreatNFTMinterAbi from "../../../treat/lib/abi/treatnftminter.json";

const web3 = new Web3("https://bsc-dataseed2.defibit.io");

const treatNFTMinter = new web3.eth.Contract(
  TreatNFTMinterAbi,
  "0xde39d0b9a93dcd541c24e80c8361f362aab0f213"
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
            const balance = await treatNFTMinter.methods
              .balanceOf(signer, id)
              .call();

            const bigNumberBalance = new BigNumber(balance);
            const numberBalance = bigNumberBalance.toNumber();

            const nftData = await NFT.findOne({ id: Number(id) });

            if (numberBalance > 0) {
              return {
                ...nftData.toObject(),
                balance: numberBalance,
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
