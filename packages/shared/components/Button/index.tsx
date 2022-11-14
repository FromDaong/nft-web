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

  variants: {
    appearance: {
      default: {
        backgroundColor: "$white",
        color: "$textContrast",
      },
      primary: {
        backgroundColor: "$mauve3",
        color: "$white",
        "&:hover": {
          backgroundColor: "$mauve2",
        },
      },
      mute: {
        backgroundColor: "gainsboro",
        "&:hover": {
          backgroundColor: "lightgray",
          //
        },
        color: "#212121",
      },
    },
    outlined: {
      true: {
        borderColor: "lightgray",
      },
    },
    link: {
      true: {
        backgroundColor: "transparent",
        color: "$mauve3",
        padding: 0,

        "&:hover": {
          backgroundColor: "transparent",
          //
        },
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
