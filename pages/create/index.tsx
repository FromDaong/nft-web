import CreateOptions from "@packages/create";
import { SEOHead } from "@packages/seo/page";
import { ContextualContainer } from "@packages/shared/components/Container";
import {
  ContextualHeading,
  ContextualHeadingContainer,
} from "@packages/shared/components/Typography/Headings";
import ApplicationLayout from "core/components/layouts/ApplicationLayout";

export default function Create() {
  return (
    <ApplicationLayout>
      <SEOHead title="Create a new post" />

      <div className="max-w-xl mx-auto">
        <ContextualHeadingContainer>
          <ContextualHeading>
            What type of trit do you want to create today?
          </ContextualHeading>
        </ContextualHeadingContainer>
        <ContextualContainer>
          <CreateOptions />
        </ContextualContainer>
      </div>
    </ApplicationLayout>
  );
}
