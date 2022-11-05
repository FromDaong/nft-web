import { Container } from "@packages/shared/components/Container";
import { styled } from "@stitches/react";
import { ComponentBasicProps } from "core/TreatCore";

const ApplicationChildrenContainer = styled("div", {
  marginTop: "12px",
});

export default function ApplicationLayout({ children }: ComponentBasicProps) {
  return (
    <Container className="flex flex-col flex-1 w-screen">
      <ApplicationChildrenContainer>{children}</ApplicationChildrenContainer>
    </Container>
  );
}
