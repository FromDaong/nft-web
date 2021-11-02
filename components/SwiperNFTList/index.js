import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import { Swiper, SwiperSlide } from "swiper/react";

const TradeInNFTs = ({ v1NFTs, account }) => {
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
          spaceBetween={50}
          slidesPerView={3}
          onSlideChange={() => console.log("slide change")}
          onSwiper={(swiper) => console.log(swiper)}
        >
          <SwiperSlide className="slide">Slide 1</SwiperSlide>
          <SwiperSlide className="slide">Slide 2</SwiperSlide>
          <SwiperSlide className="slide">Slide 3</SwiperSlide>
          <SwiperSlide className="slide">Slide 4</SwiperSlide>
        </Swiper>
      </div>
    </div>
  );
};

export default TradeInNFTs;
