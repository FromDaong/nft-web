import { styled } from "@styles/theme";
import {
  ImportantSmallText,
  MutedActionText,
  MutedParagraph,
  SmallText,
  Text,
  Username,
} from "./Text";

export const ContextualHeading = styled("h3", {
  fontSize: "32px",
  marginBottom: "12px",
  marginTop: "4px",
});

export const ContextualHeadingContainer = styled("div", {
  marginTop: "24px",
  minWidth: "400px",
  maxWidth: "520px",
});

export {
  Username,
  MutedParagraph,
  ImportantSmallText,
  Text,
  SmallText,
  MutedActionText,
};
