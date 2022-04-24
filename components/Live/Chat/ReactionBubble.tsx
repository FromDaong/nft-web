import { Box, Button } from "@chakra-ui/react";

export default function ReactionBubble({ sendReaction }) {
  return (
    <Box position="relative" display="flex" experimental_spaceX={2}>
      <Button onClick={() => sendReaction("fire")}>🔥</Button>
      <Button onClick={() => sendReaction("squid")}>🦑</Button>
      <Button onClick={() => sendReaction("laugh")}>🤣</Button>
    </Box>
  );
}
