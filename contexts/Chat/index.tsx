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
  const [isHost, setIs_host] = useState(false);
  const [host, setHost] = useState<string | null>(null);
  const { account } = useMoralis();

  const setIsPlaying = (playback_id) => {
    setCurrently_playing(playback_id);
  };

  const setIsHost = () => {
    setIs_host(true);
  };

  /*useEffect(() => {
    if (needsRetry.length > 0) {
      needsRetry.map((i) => i.retry.attempt < 4 && publish(i));
    }
  }, [needsRetry]);*/

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
    /*if (payload.retry?.attempt > 3) {
      // remove from needsRetry to prevent Infinity loop
      setNeedsRetry((needsRetry) => {
        // remove this entry
        const new_needs_retry = needsRetry.filter(
          (i) => i.index !== payload.index
        );
        return [...new_needs_retry];
      });
      return;
    }*/
    Axios.post(`/api/v2/chat/${currently_playing}/publish`, payload).catch(
      (err) => {
        console.log({ err });
        console.log(
          `Retrying ${payload.index} for attempt #${payload.retry?.attempt}`
        );
        const data: Notification = {
          ...payload,
          retry: {
            attempt: payload.retry ? payload.retry.attempt + 1 : 1,
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
        /*if (data.retry.attempt < 4) {
          setNeedsRetry([...needsRetry, data]);
        }*/
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
