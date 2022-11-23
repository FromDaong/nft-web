import { styled } from "@styles/theme";

export const TriggerButton = styled("p", {
  fontWeight: "500",
  padding: "8px 16px",
  alignItems: "center",
  gap: "6px",
  display: "flex",
});

export const Button = styled("button", {
  padding: "10px 20px",
  alignItems: "center",
  gap: "8px",
  display: "flex",
  borderRadius: "12px",
  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.01)",
  fontFamily: "'Helvetica', sans-serif",
  fontWeight: "600",
  justifyContent: "center",
  alignContent: "center",

  variants: {
    appearance: {
      default: {
        backgroundColor: "$surface",
        color: "$textContrast",
      },
      primary: {
        backgroundColor: "$textContrast",
        color: "$surface",
      },
      surface: {
        backgroundColor: "$elementOnSurface",
        color: "$textContrast",
      },
      subtle: {
        backgroundColor: "$surfaceOnSurface",
      },
    },
    outlined: {
      true: {
        border: "2px solid $subtleBorder",
        backgroundColor: "transparent",
        color: "$textContrast",
      },
    },
    fullWidth: {
      true: {
        width: "100%",
      },
    },
    link: {
      true: {
        backgroundColor: "transparent",
        color: "$textContrast",
        padding: 0,
      },
    },
  },
  defaultVariants: {
    appearance: "primary",
  },
});

export const WhiteButton = styled(Button, {
  backgroundColor: "white",
  boxShadow: "0px 2px 6px rgba(37, 41, 46, 0.04);",
  color: "#25292e",
});
