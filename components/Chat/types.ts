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

export const validateSHA256Address = (address: string): boolean => {
  const regex = /^[0-9a-f]{64}$/;
  return regex.test(address);
};

export const getParticipantByAddress = (
  address: string,
  arr: Array<ChatParticipant>
): ChatParticipant => {
  // validate this is actually a SHA256 address
  if (!validateSHA256Address(address)) {
    return null;
  }
  const participant = arr.find(
    (participant: ChatParticipant) => participant.address === address
  );
  return participant;
};
