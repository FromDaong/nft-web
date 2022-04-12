import { Flex } from "@chakra-ui/react";
import SendMessageBox from "./SendMessageBox";

export default function ChatBox() {
  return (
    <Flex
      w={["full", 3 / 4, "0.5", 1 / 3]}
      className="p-2"
      position="absolute"
      zIndex={500000}
      bottom={0}
      left={0}
    >
      <SendMessageBox />
    </Flex>
  );
}
