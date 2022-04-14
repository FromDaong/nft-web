import { Box } from "@chakra-ui/react";
import ChatContainer from "./ChatContainer";
import { LiveStreamChatContext } from "../../../contexts/Chat";
import SendMessageBox from "./SendMessageBox";
import { useContext } from "react";

export default function ChatBox() {
  const { messages, last_message, sendMessage } = useContext(
    LiveStreamChatContext
  );
  return (
    <Box
      w={[3 / 4, 3 / 4, 2 / 3, 1 / 3]}
      position="absolute"
      zIndex={500000}
      bottom={0}
      left={0}
    >
      <div className="chat-wrapper">
        <ChatContainer messages={messages} last_message={last_message} />
        <SendMessageBox sendMessage={sendMessage} />
      </div>
    </Box>
  );
}
