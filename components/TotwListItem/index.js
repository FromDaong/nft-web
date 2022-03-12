import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { Swiper, SwiperSlide } from "swiper/react";
import LazyLoad from "react-lazyload";
import NFTListItem from "../NFTListItem";
import useSWR from "swr";
import Link from "next/link";
import { getDisplayBalance } from "../../utils/formatBalance";
import useGetTreatSetCost from "../../hooks/useGetTreatSetCost";
import useRedeemSet from "../../hooks/useRedeemSet";

const TotwListItem = ({ modelData }) => {
  const { data: nftData } = useSWR(
    `/api/nft/nfts-from-username/${modelData.username}`
  );

  const setId = modelData.bundle_id;
  const nftSetPrice = useGetTreatSetCost(setId);
  const { onRedeemSet } = setId
    ? useRedeemSet(setId, nftSetPrice)
    : { onRedeemSet: null };

  return (
    <LazyLoad>
      <div className="totw-list-item-container mt-5">
        <div className="top-bar">
          <Link href={`/creator/${modelData.username}`}>
            <a>
              <div className="totw-name">
                <div
                  className="pic"
                  style={{ backgroundImage: `url(${modelData.profile_pic})` }}
                ></div>
                {modelData.username}
              </div>
            </a>
          </Link>
          <div className="button">
            <Button rounded="full" colorScheme={"purple"} onClick={onRedeemSet}>
              <b>Purchase Set {getDisplayBalance(nftSetPrice)} BNB</b>
            </Button>
          </div>
        </div>
        <div className="nft-display-section padded">
          <Swiper
            breakpoints={{
              320: {
                slidesPerView: 1,
                spaceBetween: 20,
              },
              1080: {
                slidesPerView: 3,
                spaceBetween: 10,
              },
              1540: {
                slidesPerView: 4,
                spaceBetween: 10,
              },
              1780: {
                slidesPerView: 5,
                spaceBetween: 10,
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
                if (nft && nft.totm)
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
