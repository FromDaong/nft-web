import Model from "../../../db/models/Model";
import dbConnect from "../../../utils/dbConnect";
// import User from "../../../../db/models/User";
import withSession from "../../../lib/session";

dbConnect();

export default async (req, res) => {
  const { method } = req;

  switch (method) {
    case "GET":
      try {
        const Models = await Model.find();

        const returnNFTs = await Promise.all(
          Models.map(async (n) => {
            // if (isNaN(n.id)) return;
            const newnft = await Model.updateOne(
              { _id: n._id },
              {
                profile_pic: n.profile_pic.replace(
                  "https://ipfs.infura.io/ipfs/",
                  "https://treatdao.mypinata.cloud/ipfs/"
                ),
                banner_pic: n.banner_pic.replace(
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
