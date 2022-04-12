import { ChatParticipant, Notification } from "../../components/Live/types";
import { createContext, useEffect, useState } from "react";

export const LiveStreamChatContext = createContext<{
  currently_playing: string | null;
  messages: Array<Notification>;
  last_message: Notification | null;
  participants: Array<ChatParticipant>;
  host: string | null;
  isHost: boolean;
}>({
  currently_playing: null,
  messages: [],
  last_message: null,
  participants: [],
  host: null,
  isHost: false,
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

  useEffect(() => {}, []);

  const sendMessage = async (message: Notification) => {
    return message;
  };

  const sendTip = () => {};

  const sendReaction = () => {};

  return (
    <LiveStreamChatContext.Provider
      value={{
        messages,
        currently_playing,
        last_message,
        participants,
        isHost,
        host,
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
