import { Container } from "@packages/shared/components/Container";
import { ComponentBasicProps } from "core/TreatCore";

export const StoryPreviewLayout = ({ children }: ComponentBasicProps) => (
  <Container className="w-screen h-screen">{children}</Container>
);

export const StoryListLayout = ({ children }: ComponentBasicProps) => (
  <Container className="max-w-7xl mx-auto overflow-x-auto">
    {children}
  </Container>
);
