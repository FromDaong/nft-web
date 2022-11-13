import { styled } from "@styles/theme";

export const BoldLink = styled("span", {
  fontWeight: "600 !important",
});

export const ActiveLink = styled("span", {
  fontWeight: "600 !important",
});

export const DisabledLink = styled("span", {
  fontWeight: "600 !important",
  color: "#858585",
});

export const MutedParagraph = styled("p", {
  fontSize: "14px",
  color: "#858585",
  display: "flex",
  gap: "3px",
});

export const MutedActionText = styled("p", {
  color: "#858585",
});

export const Text = styled("p", {
  fontSize: "14px",
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
