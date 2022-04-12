export type ChatType = "group-chat" | "one-to-one" | "broadcast" | "support";
export type NotificationType =
  | "message"
  | "reaction"
  | "tip"
  | "ban"
  | "kickout";

export type ReactionEmojis = "👏" | "❤️" | "🔥" | "💀" | "😂" | "🥰";

export const reaction_emojis = ["👏", "❤️", "🔥", "💀", "😂", "🥰"];

export interface ReactionMessage {
  timestamp: number;
  sender: string;
  text: ReactionEmojis;
}

export interface TipMessage {
  timestamp: number;
  amount: number;
  sender: string;
  text: string;
}
export interface ChatMessage {
  text: string;
  sender: string;
  timestamp: number;
}

export interface Notification {
  type: NotificationType;
  timestamp: number;
  payload: ChatMessage | TipMessage | ReactionMessage;
  sent: boolean;
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
  lastMessage: Notification;
  messages: {
    total: number;
    docs: Array<Notification>;
  };
  owner: string;
}

export interface LiveVideoProps {
  playback_id: string;
  streamIsActive: boolean;
}
