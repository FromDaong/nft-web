import { Container } from "@packages/shared/components/Container";
import { styled } from "@stitches/react";
import { ComponentBasicProps } from "core/TreatCore";

const ApplicationChildrenContainer = styled("div", {
  margin: "40px 0",
  overflowY: "scroll",
});

export default function FeedLayout({ children }: ComponentBasicProps) {
  return (
    <Container className="max-w-lg">
      <ApplicationChildrenContainer className="grid grid-cols-1 gap-8">
        {children}
      </ApplicationChildrenContainer>
    </Container>
  );
}
