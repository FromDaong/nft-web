import Model from "../../../../models/Model";
import { nodePusher } from "../../../../lib/pusher";
import { withJWTAuth } from "../../../../utils/server-utils";

async function auth(req, res) {
  const { session } = req;
  const { ethAddress } = session;
  const socketId = req.body.socket_id;
  const channel = req.body.channel_name;
  // MongoDB regex find
  const user = await Model.findOne({
    address: { $regex: new RegExp(ethAddress, "i") },
  });

  const presenceData = {
    user_id: "unique_user_id",
    user_info: {
      address: ethAddress,
      avatar: user.profilePicCdnUrl ?? user.profile_picture,
      username: user.username,
    },
  };
  const auth = nodePusher.authenticate(socketId, channel, presenceData);
  res.send(auth);
}

export default withJWTAuth(auth);
