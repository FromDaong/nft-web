import Model from "../../../db/models/Model";
import dbConnect from "../../../utils/dbConnect";
import withSession from "../../../lib/session";
import { withJWTAuth } from "../../../utils/server-utils";

dbConnect();

export default withJWTAuth(async (req, res) => {
  const { method } = req;
  const { ethAddress } = req.session;

  switch (method) {
    case "POST":
      try {
        const newModel = await Model.findOneAndUpdate(
          {
            address: ethAddress.toLowerCase(),
          },
          { identity_access_key: req.body.identity_access_key },
          { new: true }
        );
        console.log({ newModel, idak: req.body.identity_access_key });

        res.status(200).json({ success: true, newNFT: newModel });
      } catch (error) {
        res.status(400).json({ success: false, error: error });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
});
