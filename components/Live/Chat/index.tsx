import { Flex } from "@chakra-ui/react";
import SendMessageBox from "./SendMessageBox";

export default function ChatBox() {
  return (
    <Flex
      className="w-full p-2"
      position="absolute"
      zIndex={500000}
      bottom={12}
    >
      <SendMessageBox />
    </Flex>
  );
}
