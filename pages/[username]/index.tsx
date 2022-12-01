import { TimelineActivity } from "@packages/post/TimelineActivity";
import { SubscriptionContentPost } from "@packages/post/SubscriptionContentPost";
import { Post } from "@packages/post/types";
import { SEOHead } from "@packages/seo/page";
import { Container } from "@packages/shared/components/Container";
import { Divider } from "@packages/shared/components/Divider";
import { Heading, Text } from "@packages/shared/components/Typography/Headings";
import { MutedText } from "@packages/shared/components/Typography/Text";
import ApplicationFrame from "core/components/layouts/ApplicationFrame";
import ApplicationLayout from "core/components/layouts/ApplicationLayout";
import ProfileLayout from "core/components/layouts/ProfileLayout";
import { useRouter } from "next/router";
import SuggestedCreatorCard from "@packages/feed/components/SuggestedCreatorCard";
import { Button } from "@packages/shared/components/Button";
import SuggestedCreatorsSection from "@packages/feed/components/SuggestedCreatorsSection";
import TrendsSection from "@packages/feed/components/TrendsSection";
import ContentSidebar from "core/components/layouts/ContentSidebar";

const newCurated: Post = {
  name: "Welcome to the Tritters",
  image: {
    cdn: "/assets/cherieCover.jpg",
    ipfs: "/assets/cherieCover.jpg",
  },
  text: "Woke up feeling sexy :)",
  price: {
    value: 0.99,
    currency: "BNB",
  },
  id: "1",
  blurhash:
    "-qIFGCoMs:WBayay_NRjayj[ayj[IUWBayayj[fQIUt7j[ayayayj@WBRjoffkj[xuWBWCayj[ayWAt7fQj[ayayM{WBofj[j[fQ",
  post_type: "subscription",
  author: {
    username: "kamfeskaya",
    display_name: "Kamfes",
    avatar:
      "https://images.pexels.com/users/avatars/50964441/feyza-yildirim-157.jpeg?auto=compress&fit=crop&h=50&w=50&dpr=1",
  },
  timestamp: 782898893,
  subscription: {
    id: "8373",
    price: {
      value: 0.2,
      currency: "BNB",
    },
  },
};

export default function UserProfile() {
  const router = useRouter();
  return (
    <ApplicationLayout>
      <ApplicationFrame>
        <ProfileLayout>
          <SEOHead title={router.query.username + " - Trit"} />
          <Container className="flex justify-between gap-12">
            <Container className="max-w-xl flex flex-col gap-4 ">
              <TimelineActivity
                actionMeta={{
                  verb: "Created content",
                  joining_phrase: "on their",
                  subject: {
                    name: "subscription timeline",
                    url: "/kamfeskaya",
                  },
                }}
                {...newCurated}
              />
              <Divider dir="horizontal" />
              <TimelineActivity
                actionMeta={{
                  verb: "Collected",
                  joining_phrase: "from",
                  subject: {
                    name: "kamfeskaya",
                    url: "/kamfeskaya",
                  },
                }}
                {...newCurated}
              />
            </Container>
            <ContentSidebar>
              <SuggestedCreatorsSection
                title="Creators you might like"
                data={[]}
              />
              <TrendsSection
                data={[
                  {
                    channel: "Trending",
                    topic: "NSFW Art",
                    totalPosts: 1400,
                  },
                ]}
              />
            </ContentSidebar>
          </Container>
        </ProfileLayout>
      </ApplicationFrame>
    </ApplicationLayout>
  );
}
