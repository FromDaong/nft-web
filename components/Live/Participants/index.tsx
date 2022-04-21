import { Flex } from "@chakra-ui/react";
import ParticipantsAvatarGroup from "./PartcipantsAvatarGroup";

export default function Participants({ participants }) {
  console.log({ participants });

  return (
    <Flex zIndex={500000}>
      <ParticipantsAvatarGroup participants={participants} />
    </Flex>
  );
}
