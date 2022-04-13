import { Box } from "@chakra-ui/react";
import { useEffect } from "react";

export default function ChatContainer(props) {
  useEffect(() => {
    console.log({ messages: props.messages });
  }, [props.messages]);
  return (
    <Box w={"full"} h={"20vh"} py={2} mb={2} position="relative">
      <Box
        w="full"
        p={1}
        backgroundColor="white"
        blur="md"
        position="absolute"
        top={0}
      />
    </Box>
  );
}
