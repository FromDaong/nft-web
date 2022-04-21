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
  setHost: () => void;
  setCurrentlyPlaying: (string) => void;
  sendMessage: (message: string) => void;
  sendTip: (amount: number, message: string) => void;
  sendReaction: (text: string) => void;
  retryMessage: (payload: Notification) => void;
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
  setHost: () => null,
  setCurrentlyPlaying: (a) => ({ a }),
  retryMessage: (m) => ({ m }),
});

export const LiveStreamChatContextProvider = ({ children }) => {
  const [messages, setMessages] = useState<Array<Notification>>([]);
  const [currently_playing, setCurrently_playing] = useState<string | null>(
    null
  );
  const [needsRetry, setNeedsRetry] = useState<Array<Notification>>([]);
  const [last_message, setLastMessage] = useState<Notification | null>(null);
  const [participants, setParticipants] = useState<Array<ChatParticipant>>([]);
  const [presenceChannel, setPresenceChannel] = useState(null);
  const [presenceInfo, setPresenceInfo] = useState<{
    id: string;
    info: object;
  }>(null);
  const [isHost, setIs_host] = useState(false);
  const [host, setHost] = useState<string | null>(null);
  const { account } = useMoralis();

  const setIsPlaying = (playback_id) => {
    setCurrently_playing(playback_id);
  };

  const setIsHost = () => {
    setIs_host(true);
  };

  useEffect(() => {
    addMeToParticipants();
    return () => removeMeFromParticipants();
  }, []);

  const addMeToParticipants = () => {
    const presenceChannel = reactPusher.subscribe(
      `presence-${currently_playing}`
    );
    setPresenceChannel(presenceChannel);
    presenceChannel.bind("pusher:subscription_succeeded", function () {
      // @ts-ignore
      const me = presenceChannel.members.me;
      const userId = me.id;
      const userInfo = me.info;
      setPresenceInfo({ id: userId, info: userInfo });
      setParticipants((prevParticipants) => [
        ...prevParticipants,
        {
          user_id: userId,
          address: userInfo.address,
          username: userInfo.username,
          avatar: userInfo.avatar,
        },
      ]);
    });
  };

  const removeMeFromParticipants = () => {
    reactPusher.unsubscribe(`presence-${currently_playing}`);
    setPresenceChannel(null);
    setPresenceInfo(null);
    setParticipants((prevParticipants) =>
      prevParticipants.filter((p) => p.user_id !== presenceInfo.id)
    );
  };

  const getParticipants = () => {
    const count = presenceChannel?.members.count;
  };

  useEffect(() => {
    if (needsRetry.length > 0) {
      needsRetry.map((i) => i.retry.remaining_attempts > 0 && publish(i));
    }
  }, [needsRetry]);

  useEffect(() => {
    if (currently_playing) {
      Axios.post(`/api/v2/chat/${currently_playing}/patch`, {})
        .then((res) => {
          console.log(res.data);
        })
        .catch((err) => console.log({ err }));
    }
  }, [currently_playing]);

  useEffect(() => {
    if (last_message) {
      const index = messages.findIndex((m) => m.index === last_message.index);
      if (index === -1) {
        setMessages([...messages, last_message]);
      } else {
        const messages_copy = [...messages];
        messages_copy[index] = last_message;
        setMessages(messages_copy);
      }

      setLastMessage(null);
    }
  }, [last_message]);

  useEffect(() => {
    if (currently_playing) {
      const current_channel = reactPusher.subscribe(
        `live-${currently_playing}`
      );
      current_channel.bind("live-message", (data) => {
        setLastMessage(data);
      });

      Axios.post("/api/stream/utils/get_host", { stream_id: "stream_id" })
        .then((res) => {
          if (res.data.host) {
            setHost(res.data.host);
          }
        })
        .catch((err) => {
          console.log({ err });
          setHost(null);
        });
    } else {
      if (reactPusher.allChannels().length > 0) {
        reactPusher.unbind_all();
      }
    }
    return () => {
      reactPusher.unbind_all();
    };
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
      channel: currently_playing,
    };

    setMessages([...messages, notification]);
    publish(notification);
  };

  const sendTip = (amount: number, message: string) => {};

  const sendReaction = (message: string) => {};

  const retrySendMessage = (payload: Notification) => {
    delete payload.retry;
    setNeedsRetry((needsRetry) => {
      // remove this entry
      const new_needs_retry = needsRetry.filter(
        (i) => i.index !== payload.index
      );
      return [...new_needs_retry];
    });
    publish(payload);
  };

  const publish = (payload: Notification) => {
    if (payload.retry?.remaining_attempts <= 0) {
      // remove from needsRetry to prevent Infinity loop
      setNeedsRetry((needsRetry) => {
        // remove this entry
        const new_needs_retry = needsRetry.filter(
          (i) => i.index !== payload.index
        );
        return [...new_needs_retry];
      });
      return;
    }

    Axios.post(`/api/v2/chat/${currently_playing}/publish`, payload).catch(
      (err) => {
        console.log({ err });
        console.log(
          `Retrying ${payload.index} for attempt #${payload.retry?.remaining_attempts}`
        );

        if (payload.retry) {
          payload.retry.remaining_attempts--;
          if (payload.retry.remaining_attempts < 0) {
            return;
          }
        }

        const data: Notification = {
          ...payload,
          retry: {
            remaining_attempts: payload.retry
              ? payload.retry.remaining_attempts
              : 3,
            nextAttemptTime: new Date().getTime() + 3000,
          },
        };

        // Update messages with retry
        setMessages((messages) => {
          const index = messages.findIndex((m) => m.index === data.index);
          if (index === -1) {
            return [...messages, data];
          } else {
            const messages_copy = [...messages];
            messages_copy[index] = data;
            return messages_copy;
          }
        });

        setNeedsRetry((items) => {
          const index = items.findIndex((i) => i.index === data.index);
          if (index === -1) {
            return [...items, data];
          } else {
            const items_copy = [...items];
            items_copy[index] = data;
            return items_copy;
          }
        });
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
        setCurrentlyPlaying: setIsPlaying,
        setHost: setIsHost,
        retryMessage: retrySendMessage,
      }}
    >
      {children}
    </LiveStreamChatContext.Provider>
  );
};
