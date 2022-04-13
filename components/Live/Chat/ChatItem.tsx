import { Box, Text } from "@chakra-ui/react";

export default function ChatItem({ text, user_id, timestamp, type, sent }) {
  return (
    <Box py={1} opacity={sent ? 1 : 0.5}>
      <Text color={"white"} fontWeight={"semibold"}>
        {user_id}
      </Text>
      <Text color="white">{text}</Text>
    </Box>
  );
}
