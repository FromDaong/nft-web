import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, {
  Pagination,
  EffectCoverflow,
  Navigation,
  Autoplay,
} from "swiper";
import NFTListItem from "../NFTListItem";
import useSWR from "swr";

SwiperCore.use([Pagination, EffectCoverflow, Navigation, Autoplay]);

const TotwListItem = ({ modelData }) => {
  const { data: nftData } = useSWR(
    `/api/nft/nfts-from-username/${modelData.username}`
  );

  console.log({ nftData });

  return (
    <div className="totw-list-item-container">
      <div className="top-bar">
        <div className="totw-name">
          <div
            className="pic"
            style={{ backgroundImage: `url(${modelData.profile_pic})` }}
          ></div>
          {modelData.username}
        </div>
        <div className="button">
          <Button variant="primary py-2 px-4">
            <b>Purchase Set</b>
          </Button>
        </div>
      </div>
      <div className="nft-display-section">
        <Swiper
          modules={[Pagination, EffectCoverflow, Navigation, Autoplay]}
          effect="coverflow"
          spaceBetween={50}
          slidesPerView={5}
          style={{ width: "100%" }}
          lazy={{
            loadPrevNext: true,
            loadOnTransitionStart: true,
          }}
          autoplay={{ disableOnInteraction: true, delay: 3000 }}
          navigation
          loop
          coverflowEffect={{
            rotate: 7, // Slide rotate in degrees
            stretch: 50, // Stretch space between slides (in px)
            depth: 100, // Depth offset in px (slides translate in Z axis)
            slideShadows: false, // Enables slides shadows
          }}
        >
          {nftData &&
            nftData.nfts &&
            nftData.nfts.map((nft, i) => {
              if (nft && nft.totw)
                return (
                  <SwiperSlide className="slide" key={nft.id}>
                    <NFTListItem data={nft} disableAnimations />
                  </SwiperSlide>
                );
              else return null;
            })}
        </Swiper>
      </div>
    </div>
  );
};

export default TotwListItem;
