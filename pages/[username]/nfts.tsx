import { SEOHead } from "@packages/seo/page";
import Avatar from "@packages/shared/components/AvatarNew";
import {
  Container,
  FluidContainer,
} from "@packages/shared/components/Container";
import { ImportantSmallText } from "@packages/shared/components/Typography/Text";
import ProfileLayout from "core/components/layouts/ProfileLayout";
import { useRouter } from "next/router";

export default function NFTs() {
  const router = useRouter();
  return (
    <ProfileLayout>
      <SEOHead title={router.query.username + " - Trit"} />
      <FluidContainer justified>
        {new Array().fill(10).map((a) => (
          <NFTCard key={a} />
        ))}
      </FluidContainer>
    </ProfileLayout>
  );
}

const NFTCardMediaSection = () => {
  return (
    <Container
      variant={"unstyled"}
      css={{ height: "400px", backgroundColor: "$surfaceOnSurface" }}
    ></Container>
  );
};

const NFTCardMetadataSection = () => {
  return (
    <Container variant={"unstyled"} css={{ height: "160px" }}>
      <Container css={{ display: "flex", gap: "8px" }}>
        <Avatar name="chris" imageSrc="/" />
        <ImportantSmallText>@kamfeskaya</ImportantSmallText>
      </Container>
    </Container>
  );
};

const NFTCard = () => {
  return (
    <Container
      variant={"unstyled"}
      css={{
        height: "fit-content",
        width: "fit-content",
        borderRadius: "15px",
      }}
    >
      <NFTCardMediaSection />
      <NFTCardMetadataSection />
    </Container>
  );
};
