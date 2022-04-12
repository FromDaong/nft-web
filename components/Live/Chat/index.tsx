import { Flex } from "@chakra-ui/react";
import SendMessageBox from "./SendMessageBox";

export default function ChatBox() {
  return (
    <Flex
      w={[3 / 4, 3 / 4, 2 / 3, 1 / 3]}
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
