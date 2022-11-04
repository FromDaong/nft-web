import { Container } from "@packages/shared/components/Container";
import { styled } from "@stitches/react";
import { ComponentBasicProps } from "core/TreatCore";
import FeaturedFrame from "./FeaturedFrame";

const ApplicationChildrenContainer = styled("div", {
  marginTop: "32px",
  marginBottom: "56px",
  width: "100%",
  gap: "3em",
  display: "grid",
});

const Main = styled(Container, {
  padding: "12px 0",
  width: "56%",
  gap: "4%",
});

const RightSidebar = styled("div", {
  padding: "12px 0",
  width: "36%",
  marginTop: "32px",
  marginBottom: "56px",
  gap: "20px",
});

export default function ApplicationFrame({ children }: ComponentBasicProps) {
  return (
    <Container className="flex max-w-6xl mx-auto">
      <Main>
        <ApplicationChildrenContainer>{children}</ApplicationChildrenContainer>
      </Main>
      <RightSidebar>
        <FeaturedFrame>
          <h4 className="text-xl font-semibold">Featured trit creators</h4>
        </FeaturedFrame>
        <FeaturedFrame>
          <h4 className="text-xl font-semibold">Trending livestreams</h4>
        </FeaturedFrame>
      </RightSidebar>
    </Container>
  );
}
