import dbConnect from "../../../utils/dbConnect";
import Model from "../../../models/Model";
import withSession from "../../../lib/session";

dbConnect();

export default withSession(async (req, res) => {
  const { method } = req;

  switch (method) {
    case "POST":
      try {
        const nftBody = {
          username: req.body.username,
          address: req.body.address,
          bio: req.body.bio,
          social_account: req.body.social_account,
          profile_pic: req.body.profile_pic,
          verification_photo: req.body.verification_photo,
          nfts: [],
          pending: true,
          rejected: false,
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
