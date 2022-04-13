import Pusher from "pusher";
import ReactPusher from "pusher-js";

const app_id = process.env.PUSHER_APP_ID,
  key = process.env.PUSHER_KEY,
  secret = process.env.PUSHER_SECRET,
  cluster = process.env.PUSHER_CLUSTER;

export const nodePusher = new Pusher({
  appId: app_id,
  key,
  secret,
  cluster,
  useTLS: true,
});

export const reactPusher = new ReactPusher("68ea1848874450546ae7", {
  cluster: "us2",
});
