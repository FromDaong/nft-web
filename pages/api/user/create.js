import dbConnect from "../../../utils/dbConnect";
import Model from "../../../models/Model";
import withSession from "../../../lib/session";

dbConnect();

export default withSession(async (req, res) => {
  const { method } = req;

  switch (method) {
    case "POST":
      try {
        if (!req.body.master_password || req.body.master_password !== "lmao")
          res.status(400).json({ success: false, error: "invalid pass" });

        const nftBody = {
          username: req.body.username,
          bio: req.body.bio,
          totw: req.body.totw,
          totw_end: req.body.totw_end,
          profile_pic: req.body.profile_pic,
          nfts: [],
        };

        console.log({ nftBody });
        const newNFT = await Model.create(nftBody);

        console.log("New Model", newNFT);

        res.status(200).json({ success: true, newNFT });
      } catch (error) {
        res.status(400).json({ success: false, error: error });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
});
