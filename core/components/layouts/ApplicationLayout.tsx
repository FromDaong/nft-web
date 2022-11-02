import { Container } from "@packages/shared/components/Container";
import { styled } from "@stitches/react";
import { ComponentBasicProps } from "core/TreatCore";

const ApplicationChildrenContainer = styled("div", {
  marginTop: "32px",
  marginBottom: "56px",
});

export default function ApplicationLayout({ children }: ComponentBasicProps) {
  return (
    <Container className="flex flex-col w-screen">
      <ApplicationChildrenContainer>{children}</ApplicationChildrenContainer>
    </Container>
  );
}
