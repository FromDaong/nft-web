import { AnimatedEmoji } from "react-native-animated-emoji";
import { Box } from "@chakra-ui/react";

export default function ReactionBubble() {
  return (
    <Box position="relative">
      <AnimatedEmoji
        index={"emoji.key"} // index to identity emoji component
        style={{ bottom: 200 }} // start bottom position
        name={"sweat_smile"} // emoji name
        size={30} // font size
        duration={4000} // ms
        onAnimationCompleted={this.onAnimationCompleted} // completion handler
      />
    </Box>
  );
}
