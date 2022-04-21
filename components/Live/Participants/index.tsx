import { Flex } from "@chakra-ui/react";
import ParticipantsAvatarGroup from "./PartcipantsAvatarGroup";

export default function Participants() {
  return (
    <Flex zIndex={500000}>
      <ParticipantsAvatarGroup
        participants={[
          { user_id: "Chris", avatar: "" },
          { user_id: "Chris", avatar: "" },
          { user_id: "Chris", avatar: "" },
          { user_id: "Chris", avatar: "" },
          { user_id: "Chris", avatar: "" },
          { user_id: "Chris", avatar: "" },
        ]}
      />
    </Flex>
  );
}
