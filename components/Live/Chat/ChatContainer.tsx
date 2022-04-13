import { Box } from "@chakra-ui/react";
import ChatItem from "./ChatItem";
import { Notification } from "../types";

export default function ChatContainer(props) {
  return (
    <Box
      w={"full"}
      h={"20vh"}
      py={2}
      mb={2}
      bottom={24}
      position="absolute"
      overflowY="scroll"
      id="chat-container"
    >
      {props.messages.map((m: Notification) => (
        <ChatItem
          isLastMessage={m.index === props.messages[0]?.index}
          key={m.index}
          text={m.payload.text}
          user_id={m.payload.sender}
          type={m.type}
          sent={m.sent}
        />
      ))}
    </Box>
  );
}
