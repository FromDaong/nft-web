import {
  ImportantSmallText,
  SmallText,
  Text,
} from "@packages/shared/components/Typography/Headings";
import { HeartIcon } from "@radix-ui/react-icons";
import { DotsHorizontalIcon, GiftIcon } from "@heroicons/react/solid";
import { BoldLink } from "@packages/shared/components/Typography/Text";
import Link from "next/link";
import Avatar from "@packages/shared/components/AvatarNew";
import { PostMediaContent } from "./PostMediaContent";
import { Post } from "./types";
import { Container } from "@packages/shared/components/Container";
import { Button } from "@packages/shared/components/Button";
import {
  PostCardAction,
  PostCardCollectorsContainer,
  PostCardContainer,
  PostCardCreatorInfoContainer,
  PostCardMetaContainer,
  PostMediaContainer,
  PostVisualMediaWrapper,
} from "./blocks";

export const SubscriptionContentPost = (props: Post) => {
  const imageUrl = props.image?.cdn;
  return (
    <PostCardContainer className="py-8">
      <Container
        css={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <Container className="gap-x-4" css={{ display: "flex" }}>
          <Link href={props.author.username}>
            <a>
              <Avatar
                imageSrc={props.author.avatar}
                size={{ height: "48px", width: "48px" }}
                name={props.author.display_name}
              />
            </a>
          </Link>
          <Container>
            <PostCardCreatorInfoContainer>
              <div
                style={{
                  display: "flex",
                  columnGap: "12px",
                  alignItems: "center",
                }}
              >
                <div>
                  <Link href={props.author.username}>
                    <a>
                      <Text css={{ fontWeight: "700" }}>
                        {props.author.display_name}
                      </Text>{" "}
                      <SmallText>@{props.author.username}</SmallText> <br />
                    </a>
                  </Link>
                </div>
              </div>
            </PostCardCreatorInfoContainer>
            {props.text && (
              <PostCardMetaContainer>
                <Text>{props.text}</Text>
              </PostCardMetaContainer>
            )}
          </Container>
        </Container>
        <Container>
          <Button>Follow</Button>
        </Container>
      </Container>

      <div className="flex gap-x-4 mt-4">
        <Container css={{ width: "48px" }} />
        <Container className="flex gap-x-8">
          <div>
            <PostMediaContainer>
              <PostVisualMediaWrapper>
                <PostMediaContent
                  imageUrl={imageUrl}
                  blurhash={props.blurhash}
                  overrideText={"Subscribe to view"}
                />
              </PostVisualMediaWrapper>
            </PostMediaContainer>
            {props.post_type === "colletible" && props.collected?.length > 0 && (
              <PostCardMetaContainer>
                <PostCardCollectorsContainer>
                  <Text>
                    Collected by{" "}
                    <ImportantSmallText className="mx-1">
                      {props.collected[0]?.user.username}
                    </ImportantSmallText>{" "}
                    {props.collected?.length > 0 && (
                      <>
                        and
                        <ImportantSmallText className="mx-1">
                          others
                        </ImportantSmallText>
                      </>
                    )}
                  </Text>
                </PostCardCollectorsContainer>
              </PostCardMetaContainer>
            )}
            {props.post_type === "subscription" && props.likes?.length > 0 && (
              <PostCardMetaContainer>
                <PostCardCollectorsContainer>
                  <Text>
                    Liked by{" "}
                    <ImportantSmallText className="mx-1">
                      {props.likes[0]?.user.username}
                    </ImportantSmallText>{" "}
                    {props.likes?.length > 0 && (
                      <>
                        and
                        <ImportantSmallText className="mx-1">
                          others
                        </ImportantSmallText>
                      </>
                    )}
                  </Text>
                </PostCardCollectorsContainer>
              </PostCardMetaContainer>
            )}
          </div>
          <div className="w-16">
            <div className="flex flex-col justify-end h-full gap-6">
              <div className="flex flex-col items-center gap-6">
                <PostCardAction>
                  <button className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full">
                    <BoldLink>
                      <HeartIcon className="w-6 h-6" />
                    </BoldLink>
                  </button>
                </PostCardAction>
                <PostCardAction>
                  <button className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full">
                    <BoldLink>
                      <GiftIcon className="w-6 h-6" />
                    </BoldLink>
                  </button>
                </PostCardAction>
                <PostCardAction>
                  <button className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full">
                    <BoldLink>
                      <DotsHorizontalIcon className="w-6 h-6" />
                    </BoldLink>
                  </button>
                </PostCardAction>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </PostCardContainer>
  );
};
