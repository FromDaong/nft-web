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

SwiperCore.use([Pagination, EffectCoverflow, Navigation, Autoplay]);

const SwiperNFTList = ({ nftData }) => {
  return (
    <div className="nft-section-container">
      <div className="top-bar">
        <div className="title">Newly created</div>
        <div className="button">
          <Button variant="primary py-2 px-4">
            <b>View All</b>
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
            nftData.map((nft, i) => (
              <SwiperSlide className="slide" key={nft.id}>
                <NFTListItem data={nft} disableAnimations />
              </SwiperSlide>
            ))}
        </Swiper>
      </div>
    </div>
  );
};

export default SwiperNFTList;
