import { Box } from "@chakra-ui/react";
import ChatItem from "./ChatItem";
import { Notification } from "../types";
import { useEffect } from "react";

export default function ChatContainer(props) {
  return (
    <Box w={"full"} h={"20vh"} py={2} mb={2} position="relative">
      {props.messages.map((m: Notification) => (
        <ChatItem
          key={m.index}
          text={m.payload.text}
          user_id={m.payload.sender}
          timestamp={m.timestamp}
          type={m.type}
          sent={m.sent}
        />
      ))}
    </Box>
  );
}
