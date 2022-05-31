import Model from "../../../../db/models/Model";
import { withJWTAuth } from "./../../../../utils/server-utils";

const me = async (req, res) => {
  const { ethAddress } = req.session;

  const modelRes = await Model.findOne({
    address: { $regex: new RegExp(ethAddress, "i") },
  });

  if (!modelRes) {
    const modelData = {
      bio: "I am a new Treat explorer",
      nfts: [],
      username: ethAddress.substring(0, 6) + "..." + ethAddress.substr(-5),
      address: ethAddress,
      isModel: false,
    };
    const newModel = new Model(modelData);
    await newModel.save();
    // return new data to client
    return res.status(200).json(modelData);
  }

  const isModel =
    (modelRes._doc.identity_access_key && !modelRes._doc.rejected) ||
    modelRes._doc.pending;

  return res.status(200).json({ ...modelRes._doc, isModel });
};

export default withJWTAuth(me);
