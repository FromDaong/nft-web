import { reactPusher } from "../pusher";

export const subscribeToChannel = (channel: string) => {
  reactPusher.subscribe(channel);
};

export const unsubscribeFromChannel = (channel: string) => {
  reactPusher.unsubscribe(channel);
};
