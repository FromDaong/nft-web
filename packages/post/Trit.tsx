import { CuratedNFt } from "./CuratedPost";
import { SubscriptionContentPost } from "./SubscriptionContentPost";
import { Post } from "./types";

export default function Trit(post: Post) {
  return (
    <>
      {post.post_type === "subscription" ? (
        <SubscriptionContentPost {...post} />
      ) : (
        <CuratedNFt {...post} />
      )}
    </>
  );
}
