import { Container } from "@packages/shared/components/Container";
import { styled } from "@stitches/react";
import { ComponentBasicProps } from "core/TreatCore";

const ApplicationChildrenContainer = styled("div", {
  marginTop: "32px",
  marginBottom: "56px",
  width: "100%",
});

export default function ApplicationFrame({ children }: ComponentBasicProps) {
  return (
    <Container className="max-w-6xl mx-auto">
      <ApplicationChildrenContainer>{children}</ApplicationChildrenContainer>
    </Container>
  );
}
