import { styled } from "@styles/theme";
import OnboardingStep from "./Step";

const Overlay = styled("div", {
  position: "fixed",
  top: 0,
  left: 0,
  height: "100%",
  width: "100%",
  zIndex: 100000,
  backgroundColor: "$overlayContrast",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

export default function Onboarding({
  config,
  isOpen,
}: {
  config;
  isOpen: boolean;
}) {
  if (!isOpen) return null;
  return (
    <Overlay>
      <OnboardingStep />
    </Overlay>
  );
}
