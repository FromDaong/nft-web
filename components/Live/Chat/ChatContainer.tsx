import { Box } from "@chakra-ui/react";
import ChatItem from "./ChatItem";
import { Notification } from "../types";

export default function ChatContainer(props) {
  return (
    <Box
      w={"full"}
      h={500}
      py={2}
      mb={2}
      bottom={12}
      // position="absolute"
      overflowY="scroll"
      id="chat-container"
    >
      {props.messages
        .filter((m: Notification) => m.type !== "reaction")
        // sort by timestamp in descending order
        .sort((a, b) => b.timestamp - a.timestamp)
        .map((m: Notification) => (
          <ChatItem
            isLastMessage={m.index === props.messages[0]?.index}
            key={m.index}
            text={m.payload.text}
            user_id={m.payload.sender}
            retry={m.retry}
            sent={m.sent}
            index={m.index}
          />
        ))}
    </Box>
  );
}
