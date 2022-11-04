import { SEOHead } from "@packages/seo/page";
import PostCard from "@packages/totm/components/PostCard";
import StoryPreview from "@packages/totm/components/StoryCard";
import ApplicationFrame from "core/components/layouts/ApplicationFrame";
import ApplicationLayout from "core/components/layouts/ApplicationLayout";
import { StoryListLayout } from "core/components/layouts/StoryLayout";

export default function ForYouPage() {
  return (
    <ApplicationLayout>
      <SEOHead title="For you - Tritt" />
      <StoryListLayout>
        <div className="flex gap-8">
          {[0, 1, 2, 3, 4, 5, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((i) => (
            <div key={i} className="shrink-0">
              <StoryPreview />
            </div>
          ))}
        </div>
      </StoryListLayout>
      <ApplicationFrame>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="col-span-1">
            <PostCard />
          </div>
        ))}
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="col-span-1">
            <PostCard />
          </div>
        ))}
      </ApplicationFrame>
    </ApplicationLayout>
  );
}
