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
} from "./blocks";
import { BookmarkIcon } from "@heroicons/react/outline";
import PostUserDropdown from "./PostUserDropdown";
import UserAvatar from "core/auth/components/Avatar";

export const TimelineActivity = (
  props: Post & {
    actionMeta: {
      verb:
        | "Changed price"
        | "Listed"
        | "Made an offer"
        | "Collected"
        | "Subscribed"
        | "Created content";
      joining_phrase: string;
      subject: {
        name: string;
        url: string;
      };
    };
  }
) => {
  const imageUrl = props.image?.cdn;
  const isRedeemAction =
    props.actionMeta.verb !== "Created content" &&
    props.actionMeta.verb !== "Subscribed";

  return (
    <PostCardContainer>
      <Container
        css={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          padding: "12px 0",
        }}
      >
        <Container className="gap-x-4" css={{ display: "flex" }}>
          <Link href={props.author.username}>
            <a>
              <UserAvatar size={40} value={props.author.display_name} />
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
                      <Text>
                        <ImportantSmallText>
                          {props.author.display_name}
                        </ImportantSmallText>
                      </Text>{" "}
                      <SmallText>@{props.author.username}</SmallText> <br />
                    </a>
                  </Link>
                </div>
              </div>
            </PostCardCreatorInfoContainer>
            <Container>
              {props.actionMeta && (
                <PostCardMetaContainer>
                  <Text>
                    <ImportantSmallText css={{ color: "$accentText" }}>
                      {props.actionMeta.verb}
                    </ImportantSmallText>{" "}
                    {props.actionMeta.joining_phrase}{" "}
                    <ImportantSmallText css={{ color: "$accentText" }}>
                      {props.actionMeta.subject.name}.
                    </ImportantSmallText>{" "}
                    <p>{props.text}</p>
                  </Text>
                </PostCardMetaContainer>
              )}
            </Container>
          </Container>
        </Container>
        <Container className="flex h-full items-center">
          <PostUserDropdown />
        </Container>
      </Container>

      <Container
        css={{
          //border: "1px solid $subtleBorder",
          // borderRadius: "16px",
          backgroundColor: "$surface",
          overflow: "hidden",
          width: "fit-content",
        }}
      >
        <Container
          css={{
            overflow: "hidden",
            position: "relative",
            height: "640px",
            width: "470px",
            backgroundColor: "$surface",
            //padding: "12px",
          }}
        >
          <Container
            className="relative h-full w-full "
            css={{
              overflow: "hidden",
              // borderRadius: "8px",
            }}
          >
            <PostMediaContent
              imageUrl={imageUrl}
              blurhash={props.blurhash}
              overrideText={"Subscribe to view"}
              caption={props.text}
            />
          </Container>
        </Container>
      </Container>
    </PostCardContainer>
  );
};
