import React, { useCallback, useContext, useEffect, useRef } from "react";

import { LiveStreamChatContext } from "../../../../contexts/Chat";
import { Notification } from "../../types";

const EMOJI_MAP = {
  fire: "🔥",
  squid: "🦑",
  laugh: "🤣",
};

export const ReactionsOverlay = () => {
  const { clearLatestReactionMessage, latestReactionMessage } = useContext(
    LiveStreamChatContext
  );
  const overlayRef = useRef();

  const handleRemoveFlyingEmoji = useCallback((node) => {
    if (!overlayRef.current) return;
    //@ts-ignore
    overlayRef.current?.removeChild(node);
  }, []);

  const handleDisplayFlyingEmoji = useCallback(
    (emoji) => {
      if (!overlayRef.current) {
        return;
      }

      console.log(`⭐ Displaying flying emoji: ${emoji}`);

      const node = document.createElement("div");
      node.appendChild(document.createTextNode(EMOJI_MAP[emoji]));
      node.className =
        Math.random() * 1 > 0.5 ? "emoji wiggle-1" : "emoji wiggle-2";
      node.style.transform = `rotate(${-30 + Math.random() * 60}deg)`;
      node.style.left = `${Math.random() * 100}%`;
      //@ts-ignore
      node.src = "";
      //@ts-ignore
      overlayRef.current.appendChild(node);

      node.addEventListener("animationend", (e) =>
        handleRemoveFlyingEmoji(e.target)
      );
    },
    [handleRemoveFlyingEmoji]
  );

  const handleReceiveFlyingEmoji = useCallback(
    (e: Notification) => {
      if (!overlayRef.current) {
        return;
      }
      console.log(`🚨 New emoji message received: ${e.payload.text}`);
      handleDisplayFlyingEmoji(e.payload.text);
    },
    [handleDisplayFlyingEmoji]
  );

  // Listen for new app messages and show new flying emojis
  useEffect(() => {
    if (latestReactionMessage) {
      handleReceiveFlyingEmoji(latestReactionMessage);
      clearLatestReactionMessage;
    }
  }, [handleReceiveFlyingEmoji, latestReactionMessage]);

  // Remove all event listeners on unmount to prevent console warnings
  useEffect(
    () => () =>
      //@ts-ignore
      overlayRef.current?.childNodes.forEach((n) =>
        n.removeEventListener("animationend", handleRemoveFlyingEmoji)
      ),
    [handleRemoveFlyingEmoji]
  );

  return (
    <div className="flying-emojis" ref={overlayRef}>
      <style jsx>{`
        .flying-emojis {
          position: fixed;
          top: 0px;
          bottom: 0px;
          left: 0px;
          right: 0px;
          overflow: hidden;
          pointer-events: none;
          user-select: none;
          z-index: 99;
        }

        .flying-emojis :global(.emoji) {
          position: absolute;
          bottom: 0px;
          left: 50%;
          font-size: 48px;
          line-height: 1;
          width: 48px;
          height: 48px;
        }

        .flying-emojis :global(.emoji.wiggle-1) {
          animation: emerge 3s forwards,
            wiggle-1 1s ease-in-out infinite alternate;
        }

        .flying-emojis :global(.emoji.wiggle-2) {
          animation: emerge 3s forwards,
            wiggle-2 1s ease-in-out infinite alternate;
        }

        @keyframes emerge {
          to {
            bottom: 85%;
            opacity: 0;
          }
        }

        @keyframes wiggle-1 {
          from {
            margin-left: -50px;
          }
          to {
            margin-left: 50px;
          }
        }

        @keyframes wiggle-2 {
          from {
            margin-left: 50px;
          }
          to {
            margin-left: -50px;
          }
        }
      `}</style>
    </div>
  );
};

export default ReactionsOverlay;
