import { SEOHead } from "@packages/seo/page";
import ApplicationFrame from "core/components/layouts/ApplicationFrame";
import ApplicationLayout from "core/components/layouts/ApplicationLayout";

export default function TreatOnRamp() {
  return (
    <div>
      <SEOHead title={"Buy crypto - Treat"} />
      <ApplicationLayout>
        <ApplicationFrame></ApplicationFrame>
      </ApplicationLayout>
    </div>
  );
}
