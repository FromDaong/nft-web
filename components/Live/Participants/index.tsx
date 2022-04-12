import { Flex } from "@chakra-ui/react";
import ParticipantsAvatarGroup from "./PartcipantsAvatarGroup";

export default function Participants() {
  return (
    <Flex
      className="w-full p-2"
      position="absolute"
      zIndex={500000}
      top={0}
    >
      <ParticipantsAvatarGroup participants={[{user_id: "Chris", avatar: ""}, {user_id: "Chris", avatar: ""}, {user_id: "Chris", avatar: ""}, {user_id: "Chris", avatar: ""}, {user_id: "Chris", avatar: ""}, {user_id: "Chris", avatar: ""}]} />
    </Flex>
  );
}
