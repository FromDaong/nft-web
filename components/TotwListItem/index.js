import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import { Swiper, SwiperSlide } from "swiper/react";
import LazyLoad from "react-lazyload";
import NFTListItem from "../NFTListItem";
import useSWR from "swr";
import Link from "next/link";

const TotwListItem = ({ modelData }) => {
  const { data: nftData } = useSWR(
    `/api/nft/nfts-from-username/${modelData.username}`
  );

  console.log({ nftData });

  return (
    <LazyLoad>
      <div className="totw-list-item-container mt-5">
        <div className="top-bar">
          <Link href={`/creator/${modelData.username}`}>
            <div className="totw-name">
              <div
                className="pic"
                style={{ backgroundImage: `url(${modelData.profile_pic})` }}
              ></div>
              {modelData.username}
            </div>
          </Link>
          <div className="button">
            <Button variant="primary py-2 px-4">
              <b>Purchase Set</b>
            </Button>
          </div>
        </div>
        <div className="nft-display-section">
          <Swiper
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
            // centeredSlides
            style={{ width: "100%" }}
            navigation
            loop
          >
            {nftData &&
              nftData.nfts &&
              nftData.nfts.map((nft, i) => {
                if (nft && nft.totw)
                  return (
                    <SwiperSlide className="slide" key={nft.id}>
                      <NFTListItem data={nft} disableAnimations purple />
                    </SwiperSlide>
                  );
                else return null;
              })}
          </Swiper>
        </div>
      </div>
    </LazyLoad>
  );
};

export default TotwListItem;
