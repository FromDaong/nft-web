import {
  ImportantSmallText,
  MutedParagraph,
  Username,
  SmallText,
  Text,
} from "@packages/shared/components/Typography/Headings";
import { HeartIcon } from "@radix-ui/react-icons";
import { styled } from "@stitches/react";
import * as Avatar from "@radix-ui/react-avatar";
import Link from "next/link";
import Image from "next/image";
import { DotsHorizontalIcon, GiftIcon, ChatIcon } from "@heroicons/react/solid";
import { Divider } from "@packages/shared/components/Divider";
import { BoldLink } from "@packages/shared/components/Typography/Text";
import { useState } from "react";

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
  border: "1px solid rgba(0, 0, 0, 0.1);",
  borderRadius: "20px",
  width: "100%",
  flexShrink: "0",
});

const PostMediaContainer = styled("div", {
  width: "100%",
  height: "max-content",
});

const PostVisualMediaWrapper = styled("div", {
  width: "100%",
  height: "520px",
});
const PostAudioMediaWrapper = styled("div", {
  width: "100%",
  height: "256x",
});

const PostCardCreatorInfoContainer = styled("div", {
  padding: "12px",
  display: "flex",
  alignItems: "center",
  columnGap: "12px",
  justifyContent: "space-between",
});

const PostCardMetaContainer = styled("div", {
  padding: "12px",
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
  padding: "4px",
  width: "40px",
  height: "40px",

  svg: {
    strokeWidth: "2px",
  },
});

export default function PostCard() {
  const [motionParams, setMotionParams] = useState(motionStates.show);

  const toggleMotionParams = () => {
    if (motionParams.initial.opacity === 1) {
      setMotionParams(motionStates.hide);
    } else {
      setMotionParams(motionStates.show);
    }
  };

  return (
    <PostCardContainer>
      <PostCardCreatorInfoContainer>
        <div
          style={{ display: "flex", columnGap: "12px", alignItems: "center" }}
        >
          <div>
            <Avatar.Root className="rounded-full">
              <Avatar.Image
                className="object-cover w-12 h-12 rounded-full shadow-md"
                src="/assets/KristinCover.jpg"
              />
              <Avatar.Fallback className="rounded-full shadow-xl ">
                <p className="flex items-center justify-center w-12 h-12 bg-white border rounded-full drop-shadow-sm shadow-pink-500/10 text-slate-700">
                  TR
                </p>
              </Avatar.Fallback>
            </Avatar.Root>
          </div>
          <div>
            <Username>@tate2301</Username>
            <MutedParagraph>
              <SmallText>12 min ago</SmallText>
            </MutedParagraph>
          </div>
        </div>
        <div className="flex items-center gap-8">
          <button>
            <BoldLink>
              <GiftIcon className="w-6 h-6" />
            </BoldLink>
          </button>
          <button>
            <BoldLink>
              <DotsHorizontalIcon className="w-6 h-6" />
            </BoldLink>
          </button>
        </div>
      </PostCardCreatorInfoContainer>
      <PostMediaContainer>
        <PostVisualMediaWrapper
          style={{
            backgroundImage:
              "url('https://img.hulu.com/user/v3/artwork/8a267ee7-f537-4b8a-b0b5-17e8377bd563?base_image_bucket_name=image_manager&base_image=2f7ed314-7ed0-4942-b709-33c176aab598&size=550x825&format=jpeg')",
          }}
        />
      </PostMediaContainer>
      <PostCardMetaContainer>
        <PostCardActionsContainer>
          <PostCardAction>
            <IconWrapper>
              <HeartIcon width={"100%"} height={"100%"} />
            </IconWrapper>
          </PostCardAction>
        </PostCardActionsContainer>
        <Divider dir="vertical" />

        <Text style={{ marginTop: "4px" }}>
          <Username>@tate2301</Username> So you wanna play huh?
        </Text>

        <PostCardCollectorsContainer>
          <div style={{ display: "flex", width: "auto" }}>
            <Avatar.Root className="rounded-full">
              <Avatar.Image
                className="object-cover w-4 h-4 rounded-full"
                src="/assets/KristinCover.jpg"
              />
              <Avatar.Fallback className="rounded-full">
                <p className="flex items-center justify-center p-2 text-xs bg-white border rounded-full text-slate-700">
                  TR
                </p>
              </Avatar.Fallback>
            </Avatar.Root>
          </div>
          <MutedParagraph>
            {
              // Can also be written as liked by, in non collectible content
            }
            Collected by <ImportantSmallText>kamfeskaya</ImportantSmallText> and
            <ImportantSmallText>others</ImportantSmallText>
          </MutedParagraph>
        </PostCardCollectorsContainer>
      </PostCardMetaContainer>
    </PostCardContainer>
  );
}
