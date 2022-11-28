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
import { GiftIcon } from "@heroicons/react/outline";
import PostUserDropdown from "./PostUserDropdown";
import UserAvatar from "core/auth/components/Avatar";

export const SquaresPlusIcon = ({
  width,
  height,
  className,
}: {
  width?: number;
  height?: number;
  className?: string;
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
    width={width}
    height={height}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 002.25-2.25V6a2.25 2.25 0 00-2.25-2.25H6A2.25 2.25 0 003.75 6v2.25A2.25 2.25 0 006 10.5zm0 9.75h2.25A2.25 2.25 0 0010.5 18v-2.25a2.25 2.25 0 00-2.25-2.25H6a2.25 2.25 0 00-2.25 2.25V18A2.25 2.25 0 006 20.25zm9.75-9.75H18a2.25 2.25 0 002.25-2.25V6A2.25 2.25 0 0018 3.75h-2.25A2.25 2.25 0 0013.5 6v2.25a2.25 2.25 0 002.25 2.25z"
    />
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
        <Container className="py-4 flex gap-6">
          <button>
            <Text>
              <HeartIcon width={24} height={24} />
            </Text>
          </button>
          <button>
            <Text>
              <GiftIcon width={24} height={24} />
            </Text>
          </button>
          <button>
            <Text>
              <SquaresPlusIcon width={24} height={24} />
            </Text>
          </button>
        </Container>
      </Container>
    </PostCardContainer>
  );
};
