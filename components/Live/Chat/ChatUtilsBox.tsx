import { Box } from "@chakra-ui/react";
import ReactionBubble from "./ReactionBubble";

export default function ChatUtilsBox({ sendReaction }) {
  return (
    <Box>
      <ReactionBubble sendReaction={sendReaction} />
    </Box>
  );
}
