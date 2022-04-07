export type ChatType = "group-chat" | "one-to-one" | "broadcast" | "support";

export interface ChatMessage {
  text: string;
  sender: string;
  timestamp: number;
  index: number;
}

export interface ChatParticipant {
  username: string;
  user_id: string;
  _id: string;
  address: string;
}
export interface ChatProps {
  type: ChatType;
  participants: Array<ChatParticipant>;
  lastMessage: ChatMessage;
  messages: {
    total: number;
    docs: Array<ChatMessage>;
  };
  owner: string;
}
