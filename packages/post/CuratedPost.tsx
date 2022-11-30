import BackgroundImage from "@packages/post/BackgroundImage";
import Blurhash from "@packages/post/Blurhash";
import {
  Heading,
  ImportantSmallText,
  Text,
} from "@packages/shared/components/Typography/Headings";
import Link from "next/link";
import { Container } from "@packages/shared/components/Container";
import { Post } from "./types";
import {
  MutedText,
  SmallText,
} from "@packages/shared/components/Typography/Text";
import { PostCardAction } from "./blocks";
import { DotsHorizontalIcon } from "@heroicons/react/outline";
import { PostMediaContent } from "./PostMediaContent";
import Avatar from "@packages/shared/components/AvatarNew";
import UserAvatar from "core/auth/components/Avatar";

export const CuratedNFt = (props: Post) => {
  const imageUrl = props.image?.cdn;

  return (
    <Link href={`/post/${props.id}`}>
      <a>
        <Container
          className="flex flex-col border"
          css={{ borderColor: "$subtleBorder", borderRadius: "16px" }}
        >
          <Container className="flex p-4 gap-4">
            <Link href={`/${props.author.username}/nfts`}>
              <a>
                <Container className="rounded-full bg-gray-100">
                  <UserAvatar
                    size={40}
                    value={props.author.display_name}
                  />
                </Container>
              </a>
            </Link>
            <Container className="flex-1">
              <Link href={`/${props.author.username}/nfts`}>
                <a>
                  <p>
                    <Text>
                      {props.author.display_name}
                    </Text>
                  </p>
                  <p>
                    <MutedText>
                      <SmallText>@{props.author.username}</SmallText>
                    </MutedText>
                  </p>
                </a>
              </Link>
            </Container>
            <Container>
              <PostCardAction>
                <Text>
                  <DotsHorizontalIcon className="w-5 h-5" />
                </Text>
              </PostCardAction>
            </Container>
          </Container>
          <Container
            className="shadow relative"
            style={{
              height: props.inGrid ? "360px" : "420px",
              width: "100%",
              overflow: "hidden",
              display: "flex",
            }}
          >
            <PostMediaContent
              imageUrl={imageUrl}
              blurhash={props.blurhash}
              caption={props.text}
              overrideText={
                "The creator wants you to collect this trit before you can preview the content"
              }
            />
          </Container>
          <Container className="p-4 flex justify-between">
            <Container className="flex-1">
              <p>
                <SmallText>
                  Remaining {props.collection.minted}/
                  {props.collection.totalSupply}
                </SmallText>
              </p>
              <p>
                <Heading size="xs">{props.collection.name}</Heading>
              </p>
            </Container>
            <Container className="flex-noshrink text-right">
              <p>
                <MutedText>
                  <SmallText>Price</SmallText>
                </MutedText>
              </p>
              <Heading size="xs">
                {props.price.value} {props.price.currency}
              </Heading>
            </Container>
          </Container>
        </Container>
      </a>
    </Link>
  );
};
