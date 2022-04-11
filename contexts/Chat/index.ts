import { ChatMessage, ChatParticipant } from "../../components/Live/types";
import { createContext, useEffect } from "react";

export const LiveStreamChatContext = createContext<{
  currently_playing: string | null;
  messages: Array<ChatMessage>;
  last_message: ChatMessage | null;
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
  useEffect(() => {}, []);
};

export const PrivateChatContext = {};

export const PrivateChatContextProvider = ({ children }) => {
  useEffect(() => {}, []);
};
