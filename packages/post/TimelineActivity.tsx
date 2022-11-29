import {
  ImportantSmallText,
  SmallText,
  Text,
} from "@packages/shared/components/Typography/Headings";
import { HeartIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { PostMediaContent } from "./PostMediaContent";
import { Post } from "./types";
import { Container } from "@packages/shared/components/Container";
import {
  PostCardContainer,
  PostCardCreatorInfoContainer,
  PostCardMetaContainer,
} from "./blocks";
import { ChatAltIcon, GiftIcon } from "@heroicons/react/outline";
import PostUserDropdown from "./PostUserDropdown";
import UserAvatar from "core/auth/components/Avatar";
import { ImportantText } from "@packages/shared/components/Typography/Text";
import { Button } from "@packages/shared/components/Button";

export const ChatBubbleIcon = ({
  width,
  height,
  className,
}: {
  width?: number;
  height?: number;
  className?: string;
}) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" height={height} width={width} strokeWidth={2} stroke="currentColor" className={className}>
  <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
</svg>
);

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
              <UserAvatar data={{ ...props.author }} size={40} />
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
        <Container className="flex justify-between py-4">
          <Container className="flex gap-4">
            <button>
              <Text className="flex gap-1 items-center">
                <HeartIcon width={20} height={24} />
                <span>
                  12
                </span>
              </Text>
            </button>
            <button>
              <Text className="flex gap-1 items-center">
                <ChatBubbleIcon width={20} height={24} />
                <span>6</span>
              </Text>
            </button>
            <button>
              <Text className="flex gap-1">
                <GiftIcon width={20} height={24} />
              </Text>
            </button>
          </Container>
          <Container>
            <Button>Collect</Button>
          </Container>
        </Container>
        <Container className="flex gap-2">
            <Container className="flex items-center">
              <UserAvatar value={"chris"} size={20} />
              <UserAvatar value={"tatenda"} size={20} />
              <UserAvatar value={"putin"} size={20} />
              <UserAvatar value={"kamfes"} size={20} />
            </Container>
            <Text>Collected by <ImportantText>kamfeskaya</ImportantText> and <ImportantText>10 others</ImportantText></Text>
        </Container>
      </Container>
    </PostCardContainer>
  );
};
