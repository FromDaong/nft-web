import "videojs-contrib-hls";
import "videojs-contrib-quality-levels";
import "videojs-hls-quality-selector";
import "video.js/dist/video-js.min.css";

import { Button, Tag, useDisclosure } from "@chakra-ui/react";
import { useEffect, useState } from "react";

import BlankModal from "../../components/BlankModal";
import LiveVideo from "../Live/Video";
import { RecordCircle } from "react-bootstrap-icons";
import { useMoralis } from "react-moralis";
import useSWR from "swr";

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
      {modelData && (!modelData.live || !modelData.live.stream_id) ? (
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
        <div className="col-md-12">
          <StreamEnabled data={modelData.live} />
        </div>
      )}
    </div>
  );
};

const StreamEnabled = ({ data }) => {
  const {
    stream_key: streamKey,
    stream_id: streamId,
    playback_id: playbackId,
  } = data;
  const [streamIsActive, setStreamIsActive] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data: streamStatusResponse } = useSWR(`/api/stream/${streamId}`, {
    refreshInterval: 10000,
    revalidateOnMount: true,
  });

  useEffect(() => {
    if (streamStatusResponse) {
      const { isActive } = streamStatusResponse;
      if (streamIsActive !== isActive) setStreamIsActive(isActive);
    }
  }, [streamStatusResponse]);

  return (
    <div className="w-full py-2">
      <div className="p-2 pb-4 flex flex-col text-sm space-y-4">
        <div>
          <div className="flex items-center justify-between break-all">
            <span>
              <b>My Livestream</b>
              <br />
              <span>
                {"Status: "}
                {streamIsActive ? (
                  <Tag colorScheme={"teal"}>Active</Tag>
                ) : (
                  <Tag colorScheme={"red"}>Inactive</Tag>
                )}
              </span>
            </span>

            {
              // TODO: remove this when chat testing done
              !streamIsActive && (
                <Button colorScheme={"primary"} onClick={onOpen}>
                  Launch Livestream Modal
                </Button>
              )
            }
          </div>
          <div className="text-red-500 text-left text-sm pb-2 pt-1">
            <span className="font-bold">Note:&nbsp;</span> To start a video
            stream, please use a broadcaster software like OBS and use the
            following details:
          </div>
        </div>

        <div className="flex items-center justify-between break-all">
          <span>
            <b>STREAMING URL:</b>
            <br />
            rtmp://rtmp.livepeer.com/live/
          </span>
          <Button
            onClick={() =>
              copyTextToClipboard(`rtmp://rtmp.livepeer.com/live/`)
            }
          >
            Copy
          </Button>
        </div>
        <div className="flex items-center justify-between break-all">
          <span>
            <b>STREAM KEY:</b>
            <br />
            {streamKey}
          </span>
          <Button onClick={() => copyTextToClipboard(streamKey)}>Copy</Button>
        </div>
        {/* TODO: add disable chat logic. */}
        {/* <div className="flex items-center justify-between break-all">
          <span>
            <b>Livestream Chat</b>
            <br />
            Status:{" "}
            {true ? (
              <Tag colorScheme={"teal"}>Enabled</Tag>
            ) : (
              <Tag colorScheme={"red"}>Disabled</Tag>
            )}
          </span>
          {true ? (
            <Button colorScheme={"red"}>Disable</Button>
          ) : (
            <Button colorScheme="green">Enable</Button>
          )}
        </div> */}
        <div className="">
          <span>
            <b>Livestream Preview</b>
            <br />
            <div style={{ minHeight: 500 }} className="col-md-12">
              <LiveVideo
                streamIsActive={streamIsActive}
                playback_id={playbackId}
              />
            </div>
          </span>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
