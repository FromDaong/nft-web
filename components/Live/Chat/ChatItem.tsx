import { Box, Text } from "@chakra-ui/react";

import { useEffect } from "react";

export default function ChatItem({ text, user_id, sent, isLastMessage }) {
  useEffect(() => {
    // if is last message scroll to bottom
    if (isLastMessage) {
      const chatContainer = document.getElementById("chat-container");
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  });
  return (
    <Box py={1} opacity={sent ? 1 : 0.5}>
      <Text color={"white"} fontWeight={"semibold"}>
        {`${user_id.substring(0, 6)}...${user_id.substr(-5)}`}
      </Text>
      <Text color="white">{text}</Text>
    </Box>
  );
}
