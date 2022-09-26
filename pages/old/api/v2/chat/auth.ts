import Model from "../../../../../db/models/Model";
import { nodePusher } from "../../../../../lib/pusher";
import { withJWTAuth } from "../../../../../utils/server-utils";

async function auth(req, res) {
  const { session } = req;
  const { ethAddress } = session;
  const socketId = req.body.socket_id;
  const channel = req.body.channel_name;
  // MongoDB regex find
  const user = await Model.findOne({
    address: `${ethAddress}`.toLowerCase(),
  });

  const presenceData = {
    user_id: "unique_user_id",
    user_info: {
      address: ethAddress,
      avatar: user.profile_pic,
      username: user.username,
    },
  };
  const auth = nodePusher.authenticate(socketId, channel, presenceData);
  res.send(auth);
}

export default withJWTAuth(auth);