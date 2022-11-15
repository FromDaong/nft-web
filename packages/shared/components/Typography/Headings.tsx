import { styled } from "@styles/theme";
import {
  ImportantSmallText,
  MutedActionText,
  SmallText,
  Text,
  Username,
  MutedText,
} from "./Text";

export const Heading = styled("h1", {
  fontWeight: "700",
  color: "$textContrast",

  variants: {
    size: {
      xl: {
        fontSize: "80px",
      },
      lg: {
        fontSize: "64px",
      },
      md: {
        fontSize: "48px",
      },
      sm: {
        fontSize: "32px",
      },
      xs: {
        fontSize: "16px",
      },
      xss: {
        fontSize: "12px",
      },
    },
    weight: {
      heavy: {
        fontWeight: "900",
      },
      bold: {
        fontWeight: "700",
      },
    },
    lineH: {
      tight: {
        lineHeight: "1.05em",
      },
    },
  },

  defaultVariants: {
    size: "lg",
    lineH: "tight",
  },
});

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
      default: {
        color: "$textContrast",
      },
    },
  },

  defaultVariants: {
    appearance: "default",
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
  MutedText as MutedParagraph,
  ImportantSmallText,
  Text,
  SmallText,
  MutedActionText,
};
