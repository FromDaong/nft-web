import { createContext, useEffect } from "react";

export const LiveStreamChatContext = createContext<{
  currently_playing: string | null;
  messages: Array<{}>;
}>({
  currently_playing: null,
  messages: [],
});

export const LiveStreamChatContextProvider = ({ children }) => {
  useEffect(() => {}, []);
};

export const PrivateChatContext = {};

export const PrivateChatContextProvider = ({ children }) => {
  useEffect(() => {}, []);
};
