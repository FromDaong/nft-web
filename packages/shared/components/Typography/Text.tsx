import { styled } from "@styles/theme";

export const BoldLink = styled("a", {
  fontWeight: "600 !important",
  color: "$textContrast",
  variants: {
    hover: {
      true: {},
    },
  },
});

export const ActiveLink = styled("span", {
  fontWeight: "600 !important",
});

export const DisabledLink = styled("span", {
  fontWeight: "600 !important",
  color: "#858585",
});

export const MutedText = styled("span", {
  fontSize: "14px",
  color: "$mutedText",
  display: "flex",
  gap: "3px",
});

export const AccentText = styled("p", {
  fontSize: "14px",
  color: "#858585",
  display: "flex",
  fontWeight: "500",

  variants: {
    appearance: {
      accent: {
        color: "$accentText",
      },
      white: {
        color: "#fcfcfc",
      },
    },
  },

  defaultVariants: {
    appearance: "accent",
  },
});

export const MutedActionText = styled("p", {
  color: "#858585",
});

export const LegibleText = styled("span", {
  color: "$text",
});

export const Text = styled("span", {
  fontSize: "15px",
  color: "$text",

  variants: {
    appearance: {
      white: {
        color: "#fdfdfd",
      },
      hiContrast: {
        color: "$textContrast",
      },
    },
  },
});

export const SmallText = styled("p", {
  fontSize: "12px",
});

export const ImportantSmallText = styled("span", {
  fontSize: "14px",
  color: "#121212",
  fontWeight: "500",
});

export const Username = styled("span", {
  color: "#121212",
  fontWeight: "600",
});

export const Span = styled("span", {
  fontSize: "inherit",
  fontWeight: "inherit",
});