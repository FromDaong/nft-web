import { SubscriptionContentPost } from "@packages/post/SubscriptionContentPost";
import { Post } from "@packages/post/types";
import { SEOHead } from "@packages/seo/page";
import { Heading } from "@packages/shared/components/Typography/Headings";
import ApplicationFrame from "core/components/layouts/ApplicationFrame";
import ApplicationLayout from "core/components/layouts/ApplicationLayout";

const newCurated: Post = {
  name: "Welcome to the Tritters",
  image: {
    cdn: "https://images.pexels.com/photos/13664674/pexels-photo-13664674.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    ipfs: "https://images.pexels.com/photos/13664674/pexels-photo-13664674.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
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
        <div className="grid grid-cols-4 gap-8">
          <div className="col-span-3">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="col-span-3">
                <SubscriptionContentPost {...newCurated} />
              </div>
            ))}
          </div>
          <div className="col-span-1 mt-8">
            <Heading size="xs">Trending creators</Heading>
          </div>
        </div>
      </ApplicationFrame>
    </ApplicationLayout>
  );
}
