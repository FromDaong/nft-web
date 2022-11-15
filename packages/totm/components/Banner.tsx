import OptimizedImage from "@packages/shared/components/OptimizedImage";
import ProfileCard from "@packages/shared/components/ProfileCard";
import { Heading } from "@packages/shared/components/Typography/Headings";

const TOTMBanner = () => {
  return (
    <div className="flex flex-wrap items-center w-full">
      <div className="relative w-full h-full p-4 lg:w-1/2 md:p-8 lg:p-0">
        <OptimizedImage
          alt="TOTM Banner"
          src="https://ui8-crypter-nft.herokuapp.com/images/content/video-preview@2x.jpg"
          className="object-cover w-full h-full max-h-[60vh] shadow-xl rounded-xl"
          layout="fill"
        />
      </div>
      <div className="w-full h-full gap-8 p-4 md:p-8 lg:w-1/2">
        <div>
          <Heading>Meet our September Treat of The Month</Heading>
          <p className="max-w-2xl mx-auto mt-4">
            TOTM is a curated showcase of creators. We assist the chosen
            creators in presenting a unique set of content exclusive to
            TreatDAO.
          </p>
        </div>

        <div className="w-full gap-8 mt-8 ">
          <ProfileCard />
        </div>
      </div>
    </div>
  );
};

export default TOTMBanner;
