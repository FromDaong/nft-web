import "videojs-contrib-hls";
import "videojs-contrib-quality-levels";
import "videojs-hls-quality-selector";
import "video.js/dist/video-js.min.css";

import { useCallback, useEffect, useState } from "react";

import BlankModal from "../../components/BlankModal";
import { Button } from "@chakra-ui/react";
import { RecordCircle } from "react-bootstrap-icons";
import { useMoralis } from "react-moralis";
import useSWR from "swr";
import videojs from "video.js";

const copyTextToClipboard = (text) => {
  navigator.permissions.query({ name: "clipboard-write" }).then((result) => {
    if (result.state == "granted" || result.state == "prompt") {
      navigator.clipboard.writeText(text);
    }
  });
};

const EditProfile = ({ modelData }) => {
  const [showPendingModal, setShowPendingModal] = useState(null);
  const [showCompleteModal, setShowCompleteModal] = useState(null);
  const { account } = useMoralis();

  return (
    <div className="white-tp-bg" style={{ minHeight: 200 }}>
      <BlankModal
        show={!!showPendingModal}
        handleClose={() => setShowPendingModal(false)}
        title={"Waiting for Transaction Confirmation ⌛"}
        subtitle={
          "Please confirm this transaction in your wallet and wait here for up to a few minutes for the transaction to confirm..."
        }
        noButton={true}
        account={account}
      />
      <BlankModal
        show={!!showCompleteModal}
        handleClose={() => setShowCompleteModal(false)}
        account={account}
      />
      <div
        className="px-4 py-2 w-100 d-flex"
        style={{
          background: "#FFFDF2",
          justifyContent: "space-between",
          alignItems: "center",
          borderRadius: 8,
        }}
      >
        <div>
          <h2
            className="heading-text-primary pt-1"
            style={{
              fontSize: 24,
            }}
          >
            <RecordCircle className="pb-1 mr-1" /> Livestream Dashboard
          </h2>
        </div>
      </div>
      {!modelData.live || !modelData.live.stream_id ? (
        <div className="text-center mt-5">
          Please click the button below in order to enable Livestreaming for
          your Treat Creator account.
          <br />
          <a href="/api/model/live/create">
            <Button colorScheme="primary" className="mt-2 mb-5">
              <b>{"Enable livestreaming"}</b>
            </Button>
          </a>
        </div>
      ) : (
        <div className="container row">
          <div className="col-md-8">
            <StreamEnabled data={modelData.live} />
          </div>
          <div className="col-md-4">Chat</div>
        </div>
      )}
    </div>
  );
};

const StreamEnabled = ({ data }) => {
  const {
    playback_id: playbackId,
    stream_key: streamKey,
    stream_id: streamId,
  } = data;
  const [streamIsActive, setStreamIsActive] = useState(false);

  const { data: streamStatusResponse } = useSWR(`/api/stream/${streamId}`, {
    refreshInterval: 10000,
    revalidateOnMount: true,
  });

  if (streamStatusResponse) {
    const { isActive } = streamStatusResponse;
    if (streamIsActive !== isActive) setStreamIsActive(isActive);
  }

  const [videoEl, setVideoEl] = useState(null);

  useEffect(() => {
    if (videoEl == null) return;
    if (streamIsActive && playbackId) {
      const player = videojs(videoEl, {
        autoplay: true,
        controls: true,
        sources: [
          {
            src: `https://cdn.livepeer.com/hls/${playbackId}/index.m3u8`,
          },
        ],
      });

      player.hlsQualitySelector();

      player.on("error", () => {
        player.src(`https://cdn.livepeer.com/hls/${playbackId}/index.m3u8`);
      });
    }
  }, [streamIsActive]);

  const onVideo = useCallback((el) => {
    console.log({ el });
    setVideoEl(el);
  }, []);

  const endStream = async () => {
    await fetch(`/api/stream/${streamId}/end`);
    //mutate("/api/dashboard/stream");
  };
  <div className="col-span-1">
    <div className="relative w-full overflow-hidden pb-4 h-75 player-container">
      <div data-vjs-player className="h-full">
        <video
          id="video"
          ref={onVideo}
          className="h-full w-full h-full video-js vjs-theme-city z-4"
          controls
          playsInline
        />
      </div>
      <div className="bg-white rounded-xl flex items-center z-1 justify-center absolute right-2 top-2 px-2 py-1 text-xs  text-gray-700">
        <div
          className={`animate-pulse ${
            streamIsActive ? "bg-green-700" : "bg-yellow-600"
          } h-2 w-2 mr-2 rounded-full`}
        ></div>
        {streamIsActive ? "Live" : "Waiting for Video"}
      </div>
    </div>
    <div className="lg:p-0 mt-2 text-red-500 text-left text-sm">
      <span className="font-bold">Note:&nbsp;</span> To start a video stream,
      please use a broadcaster software like OBS and use the following details:
    </div>
    <div className="border border-dashed p-2 pb-4 mt-4 flex flex-col text-sm">
      <div className="flex items-center justify-between mt-2 break-all">
        <span>
          <b>STREAMING URL:</b>
          <br />
          rtmp://rtmp.livepeer.com/live/
        </span>
        <Button
          onClick={() => copyTextToClipboard(`rtmp://rtmp.livepeer.com/live/`)}
          className="border ml-1 p-1 rounded text-sm break-normal"
        >
          Copy
        </Button>
      </div>
      <div className="flex items-center justify-between mt-4 break-all">
        <span>
          <b>STREAM KEY:</b>
          <br />
          {streamKey}
        </span>
        <Button
          onClick={() => copyTextToClipboard(streamKey)}
          className="border ml-1 p-1 rounded text-sm break-normal"
        >
          Copy
        </Button>
      </div>
    </div>
  </div>;
  return (
    <div className="col-span-1">
      <div className="relative w-full overflow-hidden pb-4 h-75">
        <div data-vjs-player>
          <video
            id="video"
            ref={onVideo}
            className="h-full w-full h-full video-js vjs-theme-city z-4"
            controls
            playsInline
          />
        </div>
        <div className="bg-white rounded-xl flex items-center z-1 justify-center absolute right-2 top-2 px-2 py-1 text-xs  text-gray-700">
          <div
            className={`animate-pulse ${
              streamIsActive ? "bg-green-700" : "bg-yellow-600"
            } h-2 w-2 mr-2 rounded-full`}
          ></div>
          {streamIsActive ? "Live" : "Waiting for Video"}
        </div>
      </div>
      <div className="p-2 mt-2 text-left text-center text-purple">
        <span className="font-bold">Note:&nbsp;</span> To start a video stream,
        please use a broadcaster software like OBS and use the following
        details:
      </div>
      <div className="p-2 pb-4 mt-2 flex flex-col">
        <div className="flex items-center justify-between mt-2 break-all">
          <span>
            <b>INGEST URL:</b>
            <br />
            rtmp://rtmp.livepeer.com/live/
          </span>
          <Button
            colorScheme="secondary"
            onClick={() =>
              copyTextToClipboard(`rtmp://rtmp.livepeer.com/live/`)
            }
          >
            Copy URL
          </Button>
        </div>
        <div className="flex items-center justify-between mt-4 break-all">
          <span>
            <b>STREAM KEY:</b>
            <br />
            {streamKey}
          </span>
          <Button
            onClick={() => copyTextToClipboard(streamKey)}
            colorScheme="secondary"
          >
            Copy Key
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
