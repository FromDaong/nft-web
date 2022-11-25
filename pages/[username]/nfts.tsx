import { CuratedNFt } from "@packages/post/CuratedPost";
import { Post } from "@packages/post/types";
import { SEOHead } from "@packages/seo/page";
import ApplicationFrame from "core/components/layouts/ApplicationFrame";
import ApplicationLayout from "core/components/layouts/ApplicationLayout";
import ProfileLayout from "core/components/layouts/ProfileLayout";
import { useRouter } from "next/router";

const newCurated: Post = {
  name: "Welcome to the Tritters",
  collection: {
    name: "Tritters",
    totalSupply: 10,
    minted: 4,
    avatar:
      "https://images.pexels.com/photos/13664674/pexels-photo-13664674.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  /*image: {
    cdn: "https://images.pexels.com/photos/13664674/pexels-photo-13664674.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    ipfs: "https://images.pexels.com/photos/13664674/pexels-photo-13664674.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
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

export default function UserProfile() {
  const router = useRouter();
  return (
    <ApplicationLayout>
      <ApplicationFrame>
        <ProfileLayout>
          <SEOHead title={router.query.username + " - Trit"} />
          <div className="flex flex-noshrink flex-wrap">
            <CuratedNFt {...newCurated} />
          </div>
        </ProfileLayout>
      </ApplicationFrame>
    </ApplicationLayout>
  );
}
