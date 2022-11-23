import { Container } from "@packages/shared/components/Container";
import { styled } from "@styles/theme";
import { ComponentBasicProps } from "core/TreatCore";

const ApplicationChildrenContainer = styled("div", {});

export default function ApplicationLayout({ children }: ComponentBasicProps) {
  return (
    <Container className="flex flex-col flex-1 w-screen">
      <ApplicationChildrenContainer>{children}</ApplicationChildrenContainer>
    </Container>
  );
}
