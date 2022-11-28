import { GlobeAltIcon } from "@heroicons/react/outline";
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

const BankNotesIcon = ({ width, height }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    width={width}
    height={height}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z"
    />
  </svg>
);

export default function ForYouPage() {
  return (
    <ApplicationLayout>
      <SEOHead title="For you - Tritt" />
      <ApplicationFrame>
        <Container className="flex gap-12">
          <Container className="flex-1 flex flex-col gap-8">
            <Container
              className="flex mx-auto gap-4 rounded-full shadow mt-6 sticky"
              css={{
                boxShadow: "$shadow",
                overflow: "hidden",
                padding: "4px",
                backgroundColor: "$elementSurface",
              }}
            >
              <BoldLink
                className="px-8 py-2 items-center rounded-full flex gap-2"
                css={{
                  backgroundColor: "$elementOnSurface",
                  color: "$textContrast",
                }}
              >
                <GlobeAltIcon width={14} height={14} />
                <p>Discover</p>
              </BoldLink>
              <BoldLink className="px-8 py-2 flex gap-2 items-center">
                <BankNotesIcon width={14} height={14} />

                <p>Subscribed</p>
              </BoldLink>
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
