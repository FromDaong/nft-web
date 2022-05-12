import {
  Box,
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import { useCallback, useContext, useEffect } from "react";

import { ChevronDownIcon } from "@chakra-ui/icons";
import { LiveStreamChatContext } from "../../../contexts/Chat";
import { ThreeDotsVertical } from "react-bootstrap-icons";

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
      <Flex experimental_spaceX={2}>
        <Text flex={1} fontWeight={"semibold"}>
          {`${user_id.substring(0, 6)}...${user_id.substr(-5)}`}
        </Text>
        <Menu>
          <>
            <MenuButton as={Button} variant="link" size="sm">
              <ThreeDotsVertical />
            </MenuButton>
            <MenuList>
              <MenuItem>Ban </MenuItem>
              <MenuItem onClick={() => alert("Kagebunshin")}>Kick out</MenuItem>
            </MenuList>
          </>
        </Menu>
      </Flex>
      <Text color="gray.600">{text}</Text>
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
