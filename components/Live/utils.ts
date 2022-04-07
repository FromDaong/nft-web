import { ChatParticipant } from "./types";

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

export const getLivestreamPlaybackURL = (playback_id: string): string => {
  return `https://cdn.livepeer.com/hls/${playback_id}/index.m3u8`;
};
