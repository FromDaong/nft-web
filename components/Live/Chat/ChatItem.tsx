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

import { LiveStreamChatContext } from "../../../contexts/Chat";
import { ThreeDotsVertical } from "react-bootstrap-icons";
import { useMoralis } from "react-moralis";

export default function ChatItem({
  text,
  user_id,
  sent,
  isLastMessage,
  retry,
  index,
  type,
}) {
  const { account } = useMoralis();
  useEffect(() => {
    // if is last message scroll to bottom
    if (isLastMessage) {
      const chatContainer = document.getElementById("chat-container");
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  });

  const {
    retryMessage,
    messages,
    isBanned,
    banAddress,
    liftBan,
    kickout,
    host,
  } = useContext(LiveStreamChatContext);
  const retrySendMessage = useCallback(
    () => retryMessage(messages.find((i) => i.index === index)),
    [messages]
  );
  const showRetryMessage = retry ? retry.attempt === 3 : false;

  return (
    <Box
      py={1}
      opacity={sent ? 1 : 0.9}
      className={`${type === "ban" && "chat-bubble-ban"} chat-bubble`}
      bgColor={"gray.100"}
    >
      <Flex experimental_spaceX={2}>
        <Text flex={1} fontWeight={"semibold"}>
          {`${user_id.substring(0, 6)}...${user_id.substr(-5)}`}
        </Text>
        {account.toUpperCase() === host.toUpperCase() &&
          account.toUpperCase() !== user_id.toUpperCase() && (
            <Menu direction="rtl" isLazy>
              <>
                <MenuButton as={Button} variant="link" size="sm">
                  <ThreeDotsVertical />
                </MenuButton>
                <MenuList>
                  <MenuItem
                    onClick={() => {
                      isBanned ? liftBan(user_id) : banAddress(user_id);
                    }}
                  >
                    Ban{" "}
                  </MenuItem>
                  <MenuItem onClick={() => kickout(user_id)}>Kick out</MenuItem>
                </MenuList>
              </>
            </Menu>
          )}
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
