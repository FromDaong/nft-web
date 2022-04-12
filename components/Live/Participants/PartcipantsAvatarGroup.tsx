import { Avatar, AvatarGroup } from "@chakra-ui/react";

export default function ParticipantsAvatarGroup({
  participants,
}: {
  participants: Array<{
    avatar: string;
    user_id: string;
  }>;
}) {
  return (
    <AvatarGroup size="md" max={4}>
      {participants.map((p) => (
        <Avatar
          key={p.user_id}
          name="Ryan Florence"
          src="https://bit.ly/ryan-florence"
        />
      ))}
    </AvatarGroup>
  );
}
