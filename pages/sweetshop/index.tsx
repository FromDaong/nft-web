import { CuratedNFt } from "@packages/post/CuratedPost";
import { Post } from "@packages/post/types";
import { SEOHead } from "@packages/seo/page";
import {
  BoldLink,
  DisabledLink,
} from "@packages/shared/components/Typography/Text";
import ApplicationFrame from "core/components/layouts/ApplicationFrame";
import Link from "next/link";
import NFTDropdownSort from "packages/navigation/components/NFTDropdownFilter";
import { InfinityScrollListing } from "packages/shared/components/ListingSection";

const newCurated: Post = {
  name: "Welcome to the Tritters",
  collection: {
    name: "Tritters",
    totalSupply: 10,
    minted: 4,
    avatar: "/assets/cherieCover.jpg",
  },
  /*image: {
    cdn: "/assets/cherieCover.jpg",
    ipfs: "/assets/cherieCover.jpg",
  },*/
  price: {
    value: 0.99,
    currency: "BNB",
  },
  id: "1",
  blurhash:
    "-qIFGCoMs:WBayay_NRjayj[ayj[IUWBayayj[fQIUt7j[ayayayj@WBRjoffkj[xuWBWCayj[ayWAt7fQj[ayayM{WBofj[j[fQ",
  post_type: "colletible",
  author: {
    username: "kamfeskaya",
    display_name: "Kamfes",
    avatar:
      "https://images.pexels.com/users/avatars/50964441/feyza-yildirim-157.jpeg?auto=compress&fit=crop&h=50&w=50&dpr=1",
  },
  timestamp: 782898893,
};

export default function NFTS() {
  return (
    <ApplicationFrame>
      <SEOHead title="Explore NFTs" />
      <div className="w-full py-8">
        <InfinityScrollListing>
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
            <div key={i} className="col-span-1">
              <CuratedNFt inGrid {...newCurated} />
            </div>
          ))}
        </InfinityScrollListing>
      </div>
    </ApplicationFrame>
  );
}
