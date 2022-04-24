import { Box, Button } from "@chakra-ui/react";

export default function ReactionBubble({ sendReaction }) {
  return (
    <Box
      position="relative"
      py={1}
      px={2}
      display="flex"
      experimental_spaceX={2}
    >
      <Button size="sm" onClick={() => sendReaction("fire")}>
        🔥
      </Button>
      <Button size="sm" onClick={() => sendReaction("squid")}>
        🦑
      </Button>
      <Button size="sm" onClick={() => sendReaction("laugh")}>
        🤣
      </Button>
      <Button size="sm" onClick={() => sendReaction("heart")}>
        ❤️
      </Button>
    </Box>
  );
}
