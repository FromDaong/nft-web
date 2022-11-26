import SuggestedCreatorsSection from "@packages/feed/components/SuggestedCreatorsSection";
import TrendsSection from "@packages/feed/components/TrendsSection";
import NFTDropdownSort from "@packages/navigation/components/NFTDropdownFilter";
import { SubscriptionContentPost } from "@packages/post/SubscriptionContentPost";
import { TimelineActivity } from "@packages/post/TimelineActivity";
import { Post } from "@packages/post/types";
import { SEOHead } from "@packages/seo/page";
import { Container } from "@packages/shared/components/Container";
import { Divider } from "@packages/shared/components/Divider";
import { InfinityScrollListing } from "@packages/shared/components/ListingSection";
import ProfileCard from "@packages/shared/components/ProfileCard";
import { Heading } from "@packages/shared/components/Typography/Headings";
import ApplicationFrame from "core/components/layouts/ApplicationFrame";
import ApplicationLayout from "core/components/layouts/ApplicationLayout";
import Link from "next/link";

// Has to a discover creators page
// Should have tags or interests as in onboarding
/*
  Should give list of 
  featured creators, 
  recommended subscriptions, 
  creator suggestions, 
  trit collectibles, 
  trit passes.
*/

const newCurated: Post = {
  name: "Welcome to the Tritters",
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

export default function LivePage() {
  return (
    <ApplicationLayout>
      <SEOHead title="For you - Tritt" />
      <ApplicationFrame>
        <Container className="grid grid-cols-5 gap-12">
          <Container className="grid grid-cols-1 gap-12 pt-12 col-span-3">
            <Container className="gap-4 grid grid-cols-1">
              <Container>
                <TrendsSection
                  data={[
                    {
                      channel: "Trending",
                      topic: "NSFW Art",
                      totalPosts: 1400,
                    },
                  ]}
                />
              </Container>
            </Container>
            <Divider dir="horizontal" />
            <Container className="gap-8 grid grid-cols-1">
              <Heading size="sm">Subscriptions for you</Heading>
              <Container>
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="col-span-1">
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
                    <Divider dir="horizontal" />
                  </div>
                ))}
              </Container>
            </Container>

            {
              // Iterate free content, collectibles and passes from recommended topics
            }
            <Container>
              <Heading size="sm">Suggested Trit collectibles</Heading>
            </Container>
          </Container>

          <Container className="col-span-2 pt-12">
            <SuggestedCreatorsSection
              data={[]}
              title="Check out these creators"
            />
          </Container>
        </Container>
      </ApplicationFrame>
    </ApplicationLayout>
  );
}
