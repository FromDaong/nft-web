import React from "react";
import Button from "react-bootstrap/Button";
import SwiperCore, {
  Pagination,
  EffectCoverflow,
  Navigation,
  Autoplay,
} from "swiper";
import Link from "next/link";

SwiperCore.use([Pagination, EffectCoverflow, Navigation, Autoplay]);

const CreatorList = ({ modelData }) => {
  return (
    <div className="model-section-container">
      <div className="top-bar">
        <div className="title">New creators</div>
        <div className="button">
          <Link href="/creators">
            <Button variant="primary py-2 px-4">
              <b>View All</b>
            </Button>
          </Link>
        </div>
      </div>
      <div className="model-display-section row">
        {modelData &&
          modelData.slice(0, 12).map((model, i) => (
            <Link href={`/creator/${model.username}`}>
              <div className="model-list-item-container col-md-3">
                <div
                  className="pic"
                  style={{ backgroundImage: `url(${model.profile_pic})` }}
                ></div>
                <div className="creator-text">
                  <div className="name">{model.username}</div>
                  <div className="nfts">{model.nfts.length} NFTs</div>
                </div>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
};

export default CreatorList;
