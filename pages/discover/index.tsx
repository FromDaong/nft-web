import SuggestedCreatorsSection from "@packages/feed/components/SuggestedCreatorsSection";
import TrendsSection from "@packages/feed/components/TrendsSection";
import { SubscriptionContentPost } from "@packages/post/SubscriptionContentPost";
import { TimelineActivity } from "@packages/post/TimelineActivity";
import { Post } from "@packages/post/types";
import { SEOHead } from "@packages/seo/page";
import { Container } from "@packages/shared/components/Container";
import { Divider } from "@packages/shared/components/Divider";
import { Heading } from "@packages/shared/components/Typography/Headings";
import { BoldLink } from "@packages/shared/components/Typography/Text";
import ApplicationFrame from "core/components/layouts/ApplicationFrame";
import ApplicationLayout from "core/components/layouts/ApplicationLayout";
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

export default function ForYouPage() {
  return (
    <ApplicationLayout>
      <SEOHead title="For you - Tritt" />
      <ApplicationFrame>
        <Container className="flex gap-12">
          <Container className="flex-1 flex flex-col gap-8 pt-12">
            <Container
              className="flex mx-auto p-2 px-8 gap-4 rounded-full"
              css={{ border: "1px solid $subtleBorder", boxShadow: "$shadow" }}
            >
              <BoldLink>Discover</BoldLink>
              <BoldLink>Subscribed</BoldLink>
            </Container>
            <Container className="max-w-xl mx-auto flex flex-col gap-4">
              <Container className="p-4">
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
              </Container>
              <Divider dir="horizontal" />
              <Container className="p-4">
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
            </Container>
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
      </ApplicationFrame>
    </ApplicationLayout>
  );
}
