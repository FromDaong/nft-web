import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, {
  EffectCoverflow,
  Navigation,
  FreeMode,
  Autoplay,
} from "swiper";
import NFTListItem from "../NFTListItem";
import LazyLoad from "react-lazyload";
import Link from "next/link";

SwiperCore.use([EffectCoverflow, Navigation, Autoplay, FreeMode]);

const SwiperNFTList = ({ nftData }) => {
  return (
    <LazyLoad>
      <div className="nft-section-container">
        <div className="top-bar">
          <div className="title">Newly created NFTs</div>
          <div className="button">
            <Link href="/marketplace/creator">
              <Button variant="primary py-2 px-4">
                <b>View All</b>
              </Button>
            </Link>
          </div>
        </div>
        <div className="nft-display-section">
          <Swiper
            modules={[EffectCoverflow, Navigation, Autoplay, FreeMode]}
            effect="coverflow"
            freeMode={true}
            breakpoints={{
              320: {
                slidesPerView: 1,
                spaceBetween: 20,
              },
              1080: {
                slidesPerView: 3,
                spaceBetween: 40,
              },
              1540: {
                slidesPerView: 4,
                spaceBetween: 40,
              },
              1920: {
                slidesPerView: 5,
                spaceBetween: 40,
              },
            }}
            style={{ width: "100%" }}
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
    </LazyLoad>
  );
};

export default SwiperNFTList;
