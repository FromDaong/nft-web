import { Flex } from "@chakra-ui/react";

export default function ChatBox() {
  return (
    <Flex
      className="w-full p-2"
      position="absolute"
      zIndex={500000}
      bgColor="white"
      bottom={0}
    >
      Chat Box
    </Flex>
  );
}
