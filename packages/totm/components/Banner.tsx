import { CurrencyDollarIcon } from "@heroicons/react/solid";
import { Button } from "packages/shared/components/Button";
import TOTMProfileCard from "./TOTMProfileCard";

const TOTMBanner = () => {
  return (
    <div className="flex flex-wrap items-center w-full">
      <div className="w-full h-full p-4 lg:w-1/2 md:p-8 lg:p-0">
        <img
          src="https://ui8-crypter-nft.herokuapp.com/images/content/video-preview@2x.jpg"
          className="object-cover w-full h-full max-h-[60vh] shadow-xl rounded-xl"
        />
      </div>
      <div className="w-full h-full gap-8 p-4 md:p-8 lg:w-1/2">
        <div>
          <h2 className="text-5xl font-medium text-gray-900">
            Meet our September Treat of The Month
          </h2>
          <p className="max-w-2xl mx-auto mt-4">
            TOTM is a curated showcase of creators. We assist the chosen
            creators in presenting a unique set of content exclusive to
            TreatDAO.
          </p>
        </div>
        <div className="flex mt-8">
          <div className="flex items-center w-1/2 gap-4">
            <div className="w-12 h-12 bg-purple-100 border-2 border-purple-400 rounded-full"></div>
            <div>
              <p className="text-sm text-gray-400">Creator</p>
              <p className="font-medium">Cherie Noel</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center w-12 h-12 text-purple-400 border-2 border-purple-400 rounded-full bg-purple-50">
              <CurrencyDollarIcon className="w-12 h-12" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Reserve Price</p>
              <p className="font-medium">0.90 BNB</p>
            </div>
          </div>
        </div>
        <div className="w-full mt-8">
          <Button className="flex justify-center w-full text-center text-white bg-purple-600">
            Purchase set for 5.0 BNB
          </Button>
        </div>
        <div className="w-full gap-8 mt-8 ">
          <TOTMProfileCard />
        </div>
      </div>
    </div>
  );
};

export default TOTMBanner;
