import Link from "next/link";
import { useState } from "react";

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

export default function NFTItem({ redeemable }: { redeemable?: boolean }) {
  const [isImageHovered, setIsImageHovered] = useState(false);
  const [motionParams, setMotionParams] = useState(motionStates.show);

  const toggleMotionParams = () => {
    if (motionParams.initial.opacity === 1) {
      setMotionParams(motionStates.hide);
    } else {
      setMotionParams(motionStates.show);
    }
  };

  const toggleHover = () => {
    toggleMotionParams();
    setIsImageHovered(!isImageHovered);
  };

  return (
    <Link href="#">
      <a>
        <div className="w-full border border-gray-200 shadow-sm rounded-xl">
          <div
            onMouseEnter={toggleHover}
            onMouseLeave={toggleHover}
            className="relative flex-shrink-0 w-full p-4 overflow-hidden h-96 rounded-xl"
          >
            <div className="absolute top-0 left-0 z-0 w-full h-7/10">
              <img
                src="https://ui8-crypter-nft.herokuapp.com/images/content/video-preview@2x.jpg"
                alt="NFT Image"
                className={`object-cover w-full h-full ${
                  redeemable ? "blur-3xl" : null
                }`}
              />
            </div>
            {isImageHovered ? (
              <div className="absolute top-0 left-0 flex flex-col transition-opacity duration-150 justify-between w-full h-[70%] z-1 bg-gray-900/40">
                <div className="flex items-center gap-2 p-4">
                  <div className="w-8 h-8">
                    <img
                      src="https://ui8-crypter-nft.herokuapp.com/images/content/avatar-creator.jpg"
                      alt="Creator"
                      className="w-full h-full rounded-full"
                    />
                  </div>
                  <p className="text-white">
                    @<span className="text-sm font-medium">kamfeskaya</span>
                  </p>
                </div>
                <div className="p-4">
                  <h4 className="text-xl font-medium text-white">
                    The Carwash Poster #2
                  </h4>
                </div>
              </div>
            ) : null}
            <div className="absolute bottom-0 left-0 w-full p-4 bg-white h-3/10">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8">
                  <img
                    src="https://ui8-crypter-nft.herokuapp.com/images/content/avatar-creator.jpg"
                    alt="Creator"
                    className="w-full h-full rounded-full"
                  />
                </div>
                <p>
                  @<span className="font-medium">kamfeskaya</span>
                </p>
              </div>
              <div className="gap-2 mt-2">
                <p className="text-sm text-gray-400">Reserve price</p>
                <p className="font-medium uppercase">0.20 BNB</p>
              </div>
            </div>
          </div>
        </div>
      </a>
    </Link>
  );
}
