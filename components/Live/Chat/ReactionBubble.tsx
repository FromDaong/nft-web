import { Box, Button } from "@chakra-ui/react";

export default function ReactionBubble({ sendEmoji }) {
  return (
    <Box position="relative" display="flex" experimental_spaceX={2}>
      <Button onClick={() => sendEmoji("fire")}>🔥</Button>
      <Button onClick={() => sendEmoji("squid")}>🦑</Button>
      <Button onClick={() => sendEmoji("laugh")}>🤣</Button>
    </Box>
  );
}
