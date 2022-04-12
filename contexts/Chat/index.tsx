import {
  ChatMessage,
  ChatParticipant,
  Notification,
} from "../../components/Live/types";
import { createContext, useEffect, useState } from "react";

import Axios from "axios";
import { make_id } from "../../components/Live/utils";
import { reactPusher } from "../../lib/pusher";
import { useMoralis } from "react-moralis";

export const LiveStreamChatContext = createContext<{
  currently_playing: string | null;
  messages: Array<Notification>;
  last_message: Notification | null;
  participants: Array<ChatParticipant>;
  host: string | null;
  isHost: boolean;
  sendMessage: (message: string) => void;
  sendTip: (amount: number, message: string) => void;
  sendReaction: (text: string) => void;
}>({
  currently_playing: null,
  messages: [],
  last_message: null,
  participants: [],
  host: null,
  isHost: false,
  sendMessage: (message) => ({ message }),
  sendTip: (amount, message) => ({ amount, message }),
  sendReaction: (text) => ({ text }),
});

export const LiveStreamChatContextProvider = ({ children }) => {
  const [messages, setMessages] = useState<Array<Notification>>([]);
  const [currently_playing, setCurrentlyPlaying] = useState<string | null>(
    null
  );
  const [last_message, setLastMessage] = useState<Notification | null>(null);
  const [participants, setParticipants] = useState<Array<ChatParticipant>>([]);
  const [isHost, setIsHost] = useState(false);
  const [host, setHost] = useState<string | null>(null);
  const { account } = useMoralis();

  useEffect(() => {
    if (currently_playing) {
      const current_channel = reactPusher.subscribe(
        `live-${currently_playing}`
      );
      current_channel.bind("live-message", (data) => {
        setMessages((messages) => [...messages, data]);
        setLastMessage(data);
      });
    } else {
      if (reactPusher.allChannels().length > 0) {
        reactPusher.unbind_all();
      }
    }
  }, [currently_playing]);

  const sendMessage = async (message: string) => {
    const composed_message: ChatMessage = {
      sender: account,
      text: message,
      timestamp: new Date().getTime(),
    };

    const notification: Notification = {
      type: "message",
      payload: composed_message,
      timestamp: composed_message.timestamp,
      sent: false,
      index: make_id(12),
    };

    setMessages([...messages, notification]);
    publish(notification);
  };

  const sendTip = (amount: number, message: string) => {};

  const sendReaction = (message: string) => {};

  const publish = (payload: Notification) => {
    Axios.post(`/api/v2/chat/${currently_playing}/publish`, { payload }).then(
      (res) => {
        if (res.status === 200) {
          console.log("published");
          const update_item = messages.find(
            (item) => item.index === payload.index
          );
          if (update_item) {
            update_item.sent = true;
            const messages_copy = [...messages];
            messages_copy.splice(messages_copy.indexOf(update_item), 1);
            setMessages([...messages_copy, update_item]);
          }
        }
      }
    );
  };

  return (
    <LiveStreamChatContext.Provider
      value={{
        messages,
        currently_playing,
        last_message,
        participants,
        isHost,
        host,
        sendMessage,
        sendReaction,
        sendTip,
      }}
    >
      {children}
    </LiveStreamChatContext.Provider>
  );
};

export const PrivateChatContext = {};

export const PrivateChatContextProvider = ({ children }) => {
  useEffect(() => {}, []);
};
