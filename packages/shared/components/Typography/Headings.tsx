import { styled } from "@styles/theme";
import {
  ImportantSmallText,
  MutedActionText,
  AccentText,
  SmallText,
  Text,
  Username,
} from "./Text";

export const ContextualHeading = styled("h3", {
  fontSize: "32px",
  marginBottom: "12px",
  marginTop: "4px",
  color: "$textContrast",
  fontWeight: "600",

  variants: {
    appearance: {
      white: {
        color: "$white",
      },
    },
  },
});

export const ContextualHeadingContainer = styled("div", {
  marginTop: "24px",
  minWidth: "400px",
  maxWidth: "520px",
  color: "$textContrast",
});

export {
  Username,
  AccentText as MutedParagraph,
  ImportantSmallText,
  Text,
  SmallText,
  MutedActionText,
};
