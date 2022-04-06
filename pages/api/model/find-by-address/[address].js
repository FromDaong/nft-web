import Model from "../../../../models/Model";
import dbConnect from "../../../../utils/dbConnect";
import { getSessionFromToken } from "../../../../utils/server-utils";

dbConnect();

const getByAddr = async (req, res) => {
  const {
    query: { address },
    method,
  } = req;

  switch (method) {
    case "GET":
      try {
        let modelRes = await Model.findOne({
          address: { $regex: new RegExp(address, "i") },
        });

        const session = getSessionFromToken({ req });

        if (!modelRes)
          return res.status(200).json({
            bio: "I am a new Treat explorer",
            nfts: [],
            username: address.substring(0, 6) + "..." + address.substr(-5),
            address: address,
          });

        const returnData = { ...modelRes.toObject() };
        if (
          returnData.live &&
          session.ethAddress.toLowerCase() !== address.toLowerCase()
        )
          delete returnData.live.stream_key;

        return res.status(200).json(returnData);
      } catch (error) {
        console.error({ error });
        return res.status(400).json({ success: false, error: error });
      }
    default:
      res.status(400).json({ success: false });
      break;
  }
};

export default getByAddr;
