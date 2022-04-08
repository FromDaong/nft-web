import BlankModal from "../../components/BlankModal";
import useSWR from "swr";
import { useState, useCallback, useEffect } from "react";
import { Button } from "@chakra-ui/react";
import useSubscribe from "../../hooks/useSubscribe";

const LivestreamViewing = ({
  isSubscribed,
  modelData,
  subscriptionCost,
  formattedSubCost,
  account,
}) => {
  const [streamIsActive, setStreamIsActive] = useState(false);
  const [showPendingModal, setShowPendingModal] = useState(null);
  const [showCompleteModal, setShowCompleteModal] = useState(null);
  const { onSubscribe } = useSubscribe(modelData.address, 1, subscriptionCost);

  const { stream_id: streamId, playback_id: playbackId } = modelData.live;

  const handleSubscribe = async () => {
    setShowPendingModal(true);
    onSubscribe()
      .then((s) => {
        setShowPendingModal(false);
        if (s) {
          setShowCompleteModal(true);
        }
      })
      .catch((e) => console.error({ e }));
  };

  const { data: streamStatusResponse } = useSWR(`/api/stream/${streamId}`, {
    refreshInterval: 10000,
    revalidateOnMount: true,
  });

  if (streamStatusResponse) {
    const { isActive } = streamStatusResponse;
    console.log({ streamStatusResponse });
    if (streamIsActive !== isActive) setStreamIsActive(isActive);
  }

  const [videoEl, setVideoEl] = useState(null);
  const [playerEl, setPlayerEl] = useState(null);

  const onVideo = useCallback((el) => {
    setVideoEl(el);
  }, []);

  useEffect(() => {
    if (videoEl == null) return;
    if (streamIsActive && playbackId) {
      if (!playerEl) {
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
          player.reset();
          player.src(`https://cdn.livepeer.com/hls/${playbackId}/index.m3u8`);
        });

        setPlayerEl(player);
      } else {
        playerEl.reset();
        playerEl.src(`https://cdn.livepeer.com/hls/${playbackId}/index.m3u8`);
      }
    } else if (playerEl) {
      playerEl.reset();
    }
  }, [streamIsActive, playbackId]);

  if (!isSubscribed)
    return (
      <div className="not-subscribed-container">
        <div className="title">Subscribe to see {modelData.username} Live!</div>
        <div className="bio">
          To view {modelData.username} livestreams and exclusive NFTs, you must
          be a subscriber.
          <div className="amount mb-2">{formattedSubCost} BNB for 30 days</div>
          <Button onClick={handleSubscribe} colorScheme="primary">
            Subscribe to see Livestream
          </Button>
        </div>
      </div>
    );

  return (
    <>
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
      <div className="col-md-12 mt-4 container">
        <div className="col-md-8">
          <div>
            <div data-vjs-player>
              <video
                id="video"
                ref={onVideo}
                className="h-full w-full h-full video-js vjs-theme-city z-4"
                controls
                playsInline
              />
            </div>
            <div className="bg-white rounded-xl flex items-center z-1 justify-center absolute right-2 top-2 px-2 py-1 text-xs  text-gray-700 mr-3">
              <div
                className={`animate-pulse ${
                  streamIsActive ? "bg-secondary" : "bg-primary"
                } h-2 w-2 mr-2 rounded-full`}
              ></div>
              {streamIsActive ? "Live" : "Waiting for Video"}
            </div>
          </div>
        </div>
        <div className="col-md-4"></div>
      </div>
    </>
  );
};
export default LivestreamViewing;
