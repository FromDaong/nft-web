import HorizontalScroll from "packages/shared/components/HorizontalScroll";
import TOTMBanner from "./components/Banner";
import TOTMNFTItem from "./components/TOTMNFTItem";

export default function LandingPageTOTM() {
  return (
    <div className="my-12">
      <TOTMBanner />
      <div className="mt-24">
        <div className="max-w-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold text-gray-900">
              September Treat of The <br /> Month Collection
            </h2>
          </div>
        </div>
        <div className="mt-12">
          <HorizontalScroll>
            <TOTMNFTItem />
            <TOTMNFTItem />
            <TOTMNFTItem />
            <TOTMNFTItem />
            <TOTMNFTItem />
          </HorizontalScroll>
        </div>
      </div>
    </div>
  );
}
