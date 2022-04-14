import { Box, Button, Text } from "@chakra-ui/react";
import { useCallback, useContext, useEffect } from "react";

import { LiveStreamChatContext } from "../../../contexts/Chat";

export default function ChatItem({
  text,
  user_id,
  sent,
  isLastMessage,
  retry,
  index,
}) {
  useEffect(() => {
    // if is last message scroll to bottom
    if (isLastMessage) {
      const chatContainer = document.getElementById("chat-container");
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  });

  const { retryMessage, messages } = useContext(LiveStreamChatContext);
  const retrySendMessage = useCallback(
    () => retryMessage(messages.find((i) => i.index === index)),
    [messages]
  );
  const showRetryMessage = retry ? retry.attempt === 3 : false;

  return (
    <Box py={1} opacity={sent ? 1 : 0.5} className="chat-bubble">
      <Text fontWeight={"semibold"}>
        {`${user_id.substring(0, 6)}...${user_id.substr(-5)}`}
      </Text>
      <Text>{text}</Text>
      <Text color="white">{text}</Text>
      {showRetryMessage && (
        <Button
          onClick={retrySendMessage}
          variant={"link"}
          colorScheme="red"
          size="sm"
        >
          Retry
        </Button>
      )}
    </Box>
  );
}
