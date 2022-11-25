import BackgroundImage from "@packages/post/BackgroundImage";
import Blurhash from "@packages/post/Blurhash";
import OverlayContent from "@packages/post/OverlayContent";
import {
  Heading,
  Text,
  Username,
} from "@packages/shared/components/Typography/Headings";
import Link from "next/link";
import { Container } from "@packages/shared/components/Container";
import { Post } from "./types";

export const CuratedNFt = (props: Post) => {
  const imageUrl = props.image?.cdn;

  return (
    <Link href={`/post/${props.id}`}>
      <a>
        <Container
          className="shadow relative"
          style={{
            height: props.inGrid ? "360px" : "420px",
            width: props.inGrid ? "240px" : "360px",
            borderRadius: "30px",
            overflow: "hidden",
            display: "flex",
          }}
        >
          {props.image ? (
            <BackgroundImage url={imageUrl} />
          ) : (
            <Blurhash blurhash={props.blurhash} />
          )}
          <OverlayContent>
            <Container className="h-full w-full flex flex-col justify-between px-8 py-12">
              <div></div>
              <Container className="flex flex-col gap-y-4">
                <Heading css={{ color: "$surface" }} size="xs">
                  {props.name}
                </Heading>
                <Container>
                  <Container className="flex justify-between">
                    <Text css={{ color: "$surface" }}>
                      {props.price.value} {props.price.currency}
                    </Text>
                    <Text css={{ color: "$surface" }}>
                      {props.collection.minted}/{props.collection.totalSupply}
                    </Text>
                  </Container>
                </Container>
                <Container
                  className="rounded-full"
                  css={{ backgroundColor: "$overlayInvertContrast" }}
                >
                  <Container
                    className="rounded-full"
                    css={{
                      backgroundColor: "$surface",
                      width: `${
                        (props.collection.minted /
                          props.collection.totalSupply) *
                        100
                      }%`,
                      height: "8px",
                    }}
                  />
                </Container>
                <Container>
                  <Link href={`/${props.author}`}>
                    <a>
                      <Container
                        css={{
                          backgroundColor: "$overlayInvertContrast",
                          width: "fit-content",
                        }}
                        className="py-1 px-3 rounded-full"
                      >
                        <Username css={{ color: "$surface" }}>
                          {props.author.username}
                        </Username>
                      </Container>
                    </a>
                  </Link>
                </Container>
              </Container>
            </Container>
          </OverlayContent>
        </Container>
      </a>
    </Link>
  );
};
