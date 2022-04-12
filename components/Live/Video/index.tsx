import "videojs-contrib-hls";
import "videojs-contrib-quality-levels";
import "videojs-hls-quality-selector";
import "video.js/dist/video-js.min.css";

import { Box, Flex, Tag } from "@chakra-ui/react";
import { useCallback, useEffect, useMemo, useState } from "react";

import ChatBox from "../Chat";
import { LiveStreamChatContextProvider } from "../../../contexts/Chat";
import { LiveVideoProps } from "../types";
import Participants from "../Participants";
import { getLivestreamPlaybackURL } from "../utils";
import videojs from "video.js";

export default function LiveVideo(props: LiveVideoProps) {
  return (
    <LiveStreamChatContextProvider>
      <LiveVideoConsumer {...props} />
    </LiveStreamChatContextProvider>
  );
}

const LiveVideoConsumer = (props) => {
  const { playback_id, streamIsActive } = props;
  const [videoEl, setVideoEl] = useState(null);
  const playback_url = useMemo(() => getLivestreamPlaybackURL(playback_id), []);

  const onVideo = useCallback((el) => {
    setVideoEl(el);
  }, []);

  useEffect(() => {
    if (videoEl == null) return;
    if (streamIsActive && playback_id) {
      const player = videojs(videoEl, {
        autoplay: true,
        controls: true,
        sources: [
          {
            src: playback_url,
          },
        ],
      });

      // player.hlsQualitySelector();

      player.on("error", () => {
        player.src(playback_url);
      });
    }
  }, [streamIsActive, videoEl]);

  return (
    <Flex
      p={2}
      h={"full"}
      w={"full"}
      position="absolute"
      left={0}
      right={0}
      bottom={0}
      top={0}
    >
      <Box position="relative" w={"full"} h={"full"} overflow="hidden">
        <ChatBox />
        <Participants />
        <Box h={"full"} w={"full"} data-vjs-player style={{ minHeight: 400 }}>
          <video
            id="video"
            ref={onVideo}
            className="h-full w-full video-js vjs-theme-city"
            controls
            preload="auto"
            playsInline
          />
        </Box>
        <Flex right={2} top={2} position="absolute">
          <div
            className={`animate-pulse ${
              props.streamIsActive ? "bg-green-700" : "bg-yellow-600"
            } h-2 w-2 mr-2 rounded-full`}
          ></div>
          {props.streamIsActive ? (
            <Tag p={1}>Live</Tag>
          ) : (
            <Tag p={1}>Waiting for Video</Tag>
          )}
        </Flex>
      </Box>
    </Flex>
  );
};
