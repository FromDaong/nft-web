import { Flex } from "@chakra-ui/react";
import ParticipantsAvatarGroup from "./PartcipantsAvatarGroup";

export default function Participants({ participants }) {
  return (
    <Flex zIndex={500000}>
      <ParticipantsAvatarGroup participants={participants} />
    </Flex>
  );
}
