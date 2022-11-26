import { XIcon } from "@heroicons/react/solid";
import { Button } from "@packages/shared/components/Button";
import { ContextualHeading } from "@packages/shared/components/Typography/Headings";
import { styled } from "@styles/theme";
import { ReactNode } from "react";

const Surface = styled("div", {
  backgroundColor: "$elementOnSurface",
  borderRadius: "16px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  width: "50%",
  height: "80%",
  overflow: "hidden",
  position: "relative",
});

const HeadingSurface = styled("div", {
  padding: "24px 0",
  display: "flex",
  alignItems: "center",
  overflowY: "auto",
});

const BodySurface = styled("div", {
  flex: 1,
  width: "100%",
  padding: "24px",
});

const ActionsSurface = styled("div", {
  padding: "24px",
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  gap: "12px",
  borderTop: "1px solid $subtleBorder",
});

const CloseIconWrapper = styled("div", {
  borderRadius: "$full",
  padding: "4px",
  border: "2px solid $border",
  position: "absolute",
  top: "16px",
  right: "16px",
});

const CloseIconSymbol = styled(XIcon, {
  height: "16px",
  width: "16px",
});

const CloseIcon = () => (
  <CloseIconWrapper>
    <CloseIconSymbol />
  </CloseIconWrapper>
);

export const OnboardingLayout = (props: { children: ReactNode }) => {
  return (
    <Surface>
      <CloseIcon />

      <HeadingSurface></HeadingSurface>
      <BodySurface>{props.children}</BodySurface>
      <ActionsSurface>
        <Button outlined>Back</Button>
        <Button>Next</Button>
      </ActionsSurface>
    </Surface>
  );
};

export default function OnboardingStep() {
  return (
    <OnboardingLayout>
      <ContextualHeading>Let's help you get started</ContextualHeading>
    </OnboardingLayout>
  );
}
