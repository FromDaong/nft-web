import { SEOHead } from "@packages/seo/page";
import ApplicationFrame from "core/components/layouts/ApplicationFrame";
import ApplicationLayout from "core/components/layouts/ApplicationLayout";

export default function Router() {
  return (
    <div>
      <SEOHead title={"Crosschain Router - Treat"} />
      <ApplicationLayout>
        <ApplicationFrame></ApplicationFrame>
      </ApplicationLayout>
    </div>
  );
}
