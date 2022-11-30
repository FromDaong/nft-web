import { styled } from "@styles/theme";

export const BoldLink = styled("a", {
  fontWeight: "700 !important",
  color: "$textContrast",
  cursor: "pointer",
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
  color: "$text",
  display: "flex",
  gap: "3px",
});

export const AccentText = styled("p", {
  fontSize: "14px",
  color: "#858585",
  display: "flex",
  fontWeight: 600,

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
  color: "$textContrast",

  variants: {
    appearance: {
      white: {
        color: "#fdfdfd",
      },
      hiContrast: {
        color: "$textContrast",
      },
    },
    weight: {
      bold: {
        fontWeight: "bold",
      },
    },
  },
});

export const SmallText = styled("span", {
  fontSize: "12px",
  
});

export const ImportantText = styled("span", {
  fontWeight: "700",
});

export const Username = styled("span", {
  color: "#121212",
  fontWeight: "600",
  cursor: "pointer",
});

export const Span = styled("span", {
  fontSize: "inherit",
  fontWeight: "inherit",
});

export const JustifiedSpan = styled("span", {
  marginX: "4px",
});

export const Bull = () => <JustifiedSpan>&bull;</JustifiedSpan>;
