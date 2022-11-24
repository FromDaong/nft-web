import { types_of_posts } from "@packages/create";
import { PostMediaBox } from "@packages/create/components";
import { SEOHead } from "@packages/seo/page";
import { ContextualContainer } from "@packages/shared/components/Container";
import { Heading } from "@packages/shared/components/Typography/Headings";
import { Text } from "@packages/shared/components/Typography/Text";
import ApplicationLayout from "core/components/layouts/ApplicationLayout";

export type PostType = {
  type: "livestream" | "nft" | "paywall";
};

export default function PostType() {
  return (
    <ApplicationLayout>
      <SEOHead title="Create a new post" />
      <div className="grid max-w-6xl grid-cols-3 pt-12 mx-auto">
        <PostMediaBox className="col-span-3 lg:col-span-2 shadow">
          <Heading size="sm" className="mb-4">
            Let's create trits for you subscribers.
          </Heading>
          <Text>
            Deploy a standard NFT contract that you can mint to at anytime. The
            following details are used to create your own smart contract. They
            will be added to the blockchain and cannot be edited. Learn more
            about smart contracts.
          </Text>
          <ContextualContainer></ContextualContainer>
        </PostMediaBox>
      </div>
    </ApplicationLayout>
  );
}
