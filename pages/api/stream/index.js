import dbConnect from "../../../utils/dbConnect";
import PendingNFT from "../../../models/PendingNFT";
import NFT from "../../../models/NFT";
import Model from "../../../models/Model";
import withSession from "../../../lib/session";
import { contractAddresses } from "../../../treat/lib/constants";

import Web3 from "web3";

dbConnect();

const web3 = new Web3(
  "https://divine-restless-feather.bsc.quiknode.pro/f9ead03ddd05508e4fe1f6952eea26ac035c8408/"
);

function wait(time) {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve("hello"), time);
  });
}
// const contract = new web3.eth.Contract(
//   TreatMarketplaceAbi,
//   contractAddresses.creatorMart[56]
// );

export default withSession(async (req, res) => {
  const { method } = req;

  switch (method) {
    case "GET":
      try {
        res.status(200).json({ success: true });
      } catch (error) {
        res.status(400).json({ success: false, error: error });
      }
      break;
    case "POST":
      try {
        if (req.body.status !== "confirmed") return res.status(200);
        
        await wait(5000);
        

        const logs = await web3.eth.getPastLogs({
          address: contractAddresses.creatorMart[56],
          topics: [
            "0xf7cedc7e6a2774e7d4561b906b05ee6bf9ad54d7a37d85e89073694de3451f9e",
          ],
          fromBlock: req.body.blockNumber - 3,
          toBlock: req.body.blockNumber + 1,
        });

        if (!logs || logs.length === 0)
          return res.status(200).json({ success: false });

        const log = logs.find((l) => l.transactionHash === req.body.hash);
        const logDataArray = log.data
          .substring(2, log.data.length)
          .match(/.{1,64}/g);
        

        const numberOfNFTs = Web3.utils.hexToNumber("0x" + logDataArray[4]);
        

        const nftIDs = [...Array(numberOfNFTs).keys()].map((i) =>
          web3.utils.hexToNumber("0x" + logDataArray[5 + i])
        );
        

        const pendingNFTs = await PendingNFT.find({
          tx_hash: log.transactionHash,
        });
        

        await pendingNFTs.forEach(async (n, i) => {
          try {
            const nftExists = await NFT.findOne({ id: nftIDs[i] });
            if (nftExists) return nftExists;

            const newNFT = await NFT.create({
              id: nftIDs[i],
              ...n.toObject(),
            });

            await Model.updateOne(
              { address: n.model_bnb_address },
              {
                $push: {
                  nfts: {
                    id: nftIDs[i],
                  },
                },
              }
            );

            
            return newNFT;
          } catch (e) {
            console.error({ e });
          }
        });
        

        res.status(200).json({ success: true });
        
      } catch (error) {
        console.error({ error });
        res.status(200).json({ success: false, error: error });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
});
