import { Box } from "@chakra-ui/react";

export default function ChatContainer(props) {
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
