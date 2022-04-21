import "videojs-contrib-hls";
import "videojs-contrib-quality-levels";
import "videojs-hls-quality-selector";
import "video.js/dist/video-js.min.css";

import { Box, Button, Flex, Tag, useDisclosure } from "@chakra-ui/react";
import {
  LiveStreamChatContext,
  LiveStreamChatContextProvider,
} from "../../../contexts/Chat";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";

import ChatBox from "../Chat";
import { LiveVideoProps } from "../types";
import Participants from "../Participants";
import SendTipModal from "../Chat/SendTipModal";
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
  const { setCurrentlyPlaying, participants } = useContext(
    LiveStreamChatContext
  );

  const { onOpen, isOpen, onClose } = useDisclosure();

  const onVideo = useCallback((el) => {
    setVideoEl(el);
  }, []);

  useEffect(() => {
    setCurrentlyPlaying(playback_id);
  }, [playback_id]);

  useEffect(() => {
    if (videoEl == null) return;
    if (streamIsActive && playback_id) {
      const player = videojs(videoEl, {
        autoplay: true,
        controls: false,
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
        {
          //<Participants />
        }
        <Box
          bgColor="black"
          h={"full"}
          w={"full"}
          data-vjs-player
          style={{ minHeight: 400 }}
        >
          <video
            id="video"
            ref={onVideo}
            className="h-full w-full video-js vjs-theme-city"
            preload="auto"
            playsInline
          />
        </Box>
        <Flex left={2} top={2} position="absolute">
          <SendTipModal onClose={onClose} isOpen={isOpen} />
          <Participants participants={participants} />
          <Button
            size={"sm"}
            colorScheme="primary"
            ml={2}
            onClick={onOpen}
            zIndex={500000}
          >
            Send Tip
          </Button>
        </Flex>
        <Flex right={2} top={2} position="absolute">
          {props.streamIsActive ? (
            <Tag p={1}>
              Live{" "}
              <span
                className={`animate-pulse mx-1 ${
                  props.streamIsActive ? "bg-red-700" : "bg-yellow-600"
                } h-2 w-2 mr-2 rounded-full`}
              />
            </Tag>
          ) : (
            <Tag p={1}>Waiting for Video</Tag>
          )}
        </Flex>
      </Box>
    </Flex>
  );
};
