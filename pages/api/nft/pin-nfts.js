import dbConnect from "../../../utils/dbConnect";
import NFT from "../../../models/NFT";
// import User from "../../../../models/User";
import withSession from "../../../lib/session";

dbConnect();

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default async (req, res) => {
  const { method } = req;

  switch (method) {
    case "GET":
      try {
        const NFTs = await NFT.find();

        const returnNFTs = await Promise.all(
          NFTs.map(async (n, i) => {
            await sleep(i * 1000);
            const result = await fetch(
              `https://api.pinata.cloud/pinning/pinByHash`,
              {
                method: "POST",
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
                  pinata_api_key: "b949556813c4f284c550",
                  pinata_secret_api_key:
                    "7a7b755c9c067dedb142c2cb9e9c077aebf561b552c440bf67b87331bac32939",
                },
                body: JSON.stringify({
                  hashToPin: n.image.replace(
                    "https://treatdao.mypinata.cloud/ipfs/",
                    ""
                  ),
                }),
              }
            );
            console.log({ result });
            const resJSON = await result.json();
            return resJSON;
          })
        );

        res.status(200).json(returnNFTs);
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
