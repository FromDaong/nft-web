import { SEOHead } from "@packages/seo/page";
import { ContextualContainer } from "@packages/shared/components/Container";
import { ContextualHeading } from "@packages/shared/components/Typography/Headings";
import ApplicationFrame from "core/components/layouts/ApplicationFrame";

export default function Explore() {
  return (
    <ApplicationFrame>
      <SEOHead title="Explore" />
      <ContextualContainer>
        <ContextualHeading>Explore</ContextualHeading>
      </ContextualContainer>
    </ApplicationFrame>
  );
}
