import { SEOHead } from "@packages/seo/page";

export type PostType = {
  type: "livestream" | "nft" | "paywall";
};

export default function PostType() {
  return (
    <>
      <SEOHead title="Create a new post" />
    </>
  );
}
