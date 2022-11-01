import { styled } from "@stitches/react";

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
});

export const WhiteButton = styled(Button, {
  backgroundColor: "white",
  boxShadow: "0px 2px 6px rgba(37, 41, 46, 0.04);",
  color: "#25292e",
});
