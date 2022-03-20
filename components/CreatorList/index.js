import SwiperCore, {
  Autoplay,
  EffectCoverflow,
  Navigation,
  Pagination,
} from "swiper";

import { Button } from "@chakra-ui/react";
import GumletImage from "../Image/GumletImage";
import Link from "next/link";

SwiperCore.use([Pagination, EffectCoverflow, Navigation, Autoplay]);

const CreatorList = ({ modelData }) => {
  const modelsWithNFTs =
    modelData &&
    modelData
      .map((model) => (model.nfts && model.nfts.length > 0 ? model : null))
      .filter((e) => e);
  return (
    <div className="model-section-container">
      <div className="top-bar">
        <div className="title">New creators</div>
        <div className="button">
          <Link href="/creators">
            <a>
              <Button className="bg-primary text-white" rounded="full">
                View All
              </Button>
            </a>
          </Link>
        </div>
      </div>
      <div className="model-display-section row">
        {modelsWithNFTs &&
          modelsWithNFTs.slice(0, 12).map((model) => {
            const profilePic = model.profilePicCdnUrl ?? model.profile_pic;
            const profilePicUrl = `/api/v2/utils/images/fetchWithFallback?default=${profilePic}`;
            return (
              <Link key={model.username} href={`/creator/${model.username}`}>
                <a className="model-list-item-container col-md-3">
                  <div className="creator-pic">
                    <GumletImage src={profilePicUrl} />
                  </div>
                  <div className="creator-text">
                    <div className="name">{model.username}</div>
                    <div className="nfts">{model.nfts.length} NFTs</div>
                  </div>
                </a>
              </Link>
            );
          })}
      </div>
    </div>
  );
};

export default CreatorList;
