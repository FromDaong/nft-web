import { SEOHead } from "@packages/seo/page";
import ApplicationFrame from "core/components/layouts/ApplicationFrame";
import ApplicationLayout from "core/components/layouts/ApplicationLayout";

export default function Swap() {
  return (
    <div>
      <SEOHead title={"Treat Swap"} />
      <ApplicationLayout>
        <ApplicationFrame></ApplicationFrame>
      </ApplicationLayout>
    </div>
  );
}
