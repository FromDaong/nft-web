import { styled } from "@styles/theme";

export const TriggerButton = styled("p", {
  fontWeight: "500",
  padding: "8px 16px",
  alignItems: "center",
  gap: "6px",
  display: "flex",
});

export const Button = styled("button", {
  padding: "8px 16px",
  alignItems: "center",
  gap: "6px",
  display: "flex",
  borderRadius: "12px",
  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.01)",
  fontFamily: "'Helvetica', sans-serif",
  fontWeight: "600",
  color: "$accentTextContrast",
  backgroundColor: "$accentBg",

  variants: {
    color: {
      default: {
        backgroundColor: "blueviolet",
        color: "white",
        "&:hover": {
          backgroundColor: "darkviolet",
        },
      },
      primary: {
        backgroundColor: "pink",
        color: "#212121",
        "&:hover": {
          backgroundColor: "darkpink",
        },
      },
      mute: {
        backgroundColor: "gainsboro",
        "&:hover": {
          backgroundColor: "lightgray",
        },
        color: "#212121",
      },
    },
    outlined: {
      true: {
        borderColor: "lightgray",
      },
    },
  },
  compoundVariants: [
    {
      color: "violet",
      outlined: true,
      css: {
        color: "blueviolet",
        borderColor: "darkviolet",
        "&:hover": {
          color: "white",
        },
      },
    },
    {
      color: "gray",
      outlined: true,
      css: {
        color: "gray",
        borderColor: "lightgray",
        "&:hover": {
          color: "black",
        },
      },
    },
  ],
});

export const WhiteButton = styled(Button, {
  backgroundColor: "white",
  boxShadow: "0px 2px 6px rgba(37, 41, 46, 0.04);",
  color: "#25292e",
});
