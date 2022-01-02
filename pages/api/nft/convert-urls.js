import dbConnect from "../../../utils/dbConnect";
import NFT from "../../../models/NFT";
// import User from "../../../../models/User";
import withSession from "../../../lib/session";

dbConnect();

export default async (req, res) => {
  const { method } = req;

  switch (method) {
    case "GET":
      try {
        const NFTs = await NFT.find();

        const returnNFTs = await Promise.all(
          NFTs.map(async (n) => {
            const newnft = await NFT.updateOne(
              { id: n.id },
              {
                image: n.image.replace(
                  "https://ipfs.infura.io/ipfs/",
                  "https://treatdao.mypinata.cloud/ipfs/"
                ),
              }
            );

            return newnft;
          })
        );

        res.status(200).json(returnNFTs);
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
