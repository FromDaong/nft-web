import { SEOHead } from "@packages/seo/page";
import PostCard from "@packages/totm/components/PostCard";
import ApplicationFrame from "core/components/layouts/ApplicationFrame";
import ApplicationLayout from "core/components/layouts/ApplicationLayout";

export default function ForYouPage() {
  return (
    <ApplicationLayout>
      <SEOHead title="For you - Tritt" />
      <ApplicationFrame>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="col-span-1"></div>
        ))}
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="col-span-1"></div>
        ))}
      </ApplicationFrame>
    </ApplicationLayout>
  );
}
