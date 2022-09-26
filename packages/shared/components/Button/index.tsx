import { styled } from "@stitches/react";

export const TriggerButton = styled("p", {
  backgroundColor: "gainsboro",
  fontWeight: "500",
  borderRadius: "9999px",
  padding: "8px 16px",
  alignItems: "center",
  gap: "6px",
  display: "flex",
  "&:hover": {
    backgroundColor: "lightgray",
  },
});

export const Button = styled("button", {
  fontWeight: "500",
  borderRadius: "9999px",
  padding: "8px 20px",
  alignItems: "center",
  gap: "6px",
  display: "flex",
});
