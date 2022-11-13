import {
  ImportantSmallText,
  MutedParagraph,
  Username,
  SmallText,
  Text,
} from "@packages/shared/components/Typography/Headings";
import { HeartIcon } from "@radix-ui/react-icons";
import { styled } from "@styles/theme";
import { DotsHorizontalIcon, GiftIcon } from "@heroicons/react/solid";
import { BoldLink } from "@packages/shared/components/Typography/Text";
import { useState } from "react";
import Avatar from "@packages/shared/components/Avatar";
import { ChatAltIcon, SaveIcon } from "@heroicons/react/outline";

export type Post = {
  id: string;
  author: {
    id: string;
    username: string;
    address: string;
    avatar: string;
    followerCount: string;
  };
  meta: {
    likes: {
      total: number;
      people: Array<{
        username: string;
        avatar;
      }>;
    };
    collectors: {
      total: number;
      people: Array<{
        username: string;
        avatar;
      }>;
    };
    impressions: Array<string>;
  };
  post_type: "IMAGE" | "VIDEO" | "AUDIO";
  post_category: "subscription" | "special" | "collectible";
  description: string;
  created_at: number;
  media: Array<{
    caption: string;
    url: string;
  }>;
  blurhash: string;
};

const motionStates = {
  show: {
    initial: {
      opacity: 0,
      scale: 0.5,
    },
    animate: {
      opacity: 1,
      scale: 1,
    },
  },
  hide: {
    initial: {
      opacity: 1,
      scale: 1,
    },
    animate: {
      opacity: 0,
      scale: 0.5,
    },
  },
};

const PostCardContainer = styled("div", {
  // border: "1px solid rgba(0, 0, 0, 0.1);",
  borderRadius: "20px",
  width: "100%",
  flexShrink: "0",
});

const PostMediaContainer = styled("div", {
  width: "100%",
  height: "max-content",
  borderRadius: "12px",
  overflow: "hidden",
});

const PostVisualMediaWrapper = styled("div", {
  width: "100%",
  height: "520px",
});

const PostCardCreatorInfoContainer = styled("div", {
  padding: "4px 0",
  display: "flex",
  alignItems: "center",
  columnGap: "12px",
  justifyContent: "space-between",
});

const PostCardMetaContainer = styled("div", {
  padding: "4px 0",
  display: "flex",
  flexDirection: "column",
});

const PostCardActionsContainer = styled("div", {
  display: "flex",
  gap: "12px",
  justifyContent: "flex-start",
});

const PostCardAction = styled("button", {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "0 2px",
});

const PostCardCollectorsContainer = styled("div", {
  marginTop: "12px",
  display: "flex",
  position: "relative",
  columnGap: "12px",
  alignItems: "center",
});

const IconWrapper = styled("p", {
  padding: "8px",
  width: "40px",
  height: "40px",

  svg: {
    strokeWidth: "2px",
  },
});

export default function PostCard() {
  const [motionParams, setMotionParams] = useState(motionStates.show);

  return (
    <PostCardContainer className="flex py-8">
      <div className="w-16">
        <Avatar size={16} />
      </div>

      <div className="flex-1 px-4">
        <PostCardCreatorInfoContainer>
          <div
            style={{ display: "flex", columnGap: "12px", alignItems: "center" }}
          >
            <div>
              <Username>@tate2301</Username>
              <MutedParagraph>
                <SmallText>12 min ago</SmallText>
              </MutedParagraph>
            </div>
          </div>
        </PostCardCreatorInfoContainer>
        <PostCardMetaContainer>
          <Text style={{ marginTop: "4px" }}>
            Spicy content. Directly from the creators!
          </Text>
        </PostCardMetaContainer>
        <PostMediaContainer>
          <PostVisualMediaWrapper
            style={{
              backgroundImage:
                "url('https://img.hulu.com/user/v3/artwork/8a267ee7-f537-4b8a-b0b5-17e8377bd563?base_image_bucket_name=image_manager&base_image=2f7ed314-7ed0-4942-b709-33c176aab598&size=550x825&format=jpeg')",
            }}
          />
        </PostMediaContainer>
        <PostCardMetaContainer>
          <PostCardCollectorsContainer>
            <MutedParagraph>
              {
                // Can also be written as liked by, in non collectible content
              }
              Collected by <ImportantSmallText>kamfeskaya</ImportantSmallText>{" "}
              and
              <ImportantSmallText>others</ImportantSmallText>
            </MutedParagraph>
          </PostCardCollectorsContainer>
        </PostCardMetaContainer>
      </div>

      <div className="w-16 pb-16">
        <div className="flex flex-col justify-between h-full gap-6">
          <div className="flex flex-col items-center gap-6">
            <PostCardAction>
              <button className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full">
                <BoldLink>
                  <DotsHorizontalIcon className="w-6 h-6" />
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
          </div>
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
                  <ChatAltIcon className="w-6 h-6" />
                </BoldLink>
              </button>
            </PostCardAction>
            <PostCardAction>
              <button className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full">
                <BoldLink>
                  <SaveIcon className="w-6 h-6" />
                </BoldLink>
              </button>
            </PostCardAction>
          </div>
        </div>
      </div>
    </PostCardContainer>
  );
}
