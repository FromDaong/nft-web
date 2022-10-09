import { ArrowRightIcon } from "@heroicons/react/solid";
import Link from "next/link";
import LandingPageHeader from "packages/shared/components/Header";
import ListingSection from "packages/shared/components/ListingSection";
import MagazineBanner from "packages/shared/components/MagazineBanner";
import NFTItem from "packages/shared/components/NFTItem";
import TOTMProfileCard from "packages/totm/components/TOTMProfileCard";
import LandingPageTOTM from "packages/totm/LandingPageTOTM";

export default function Test() {
  return (
    <>
      <LandingPageHeader />
      <LandingPageTOTM />
      <div className="px-4 mt-24 md:px-8 lg:px-0">
        <div className="w-full">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-medium text-gray-900 md:text-3xl">
              Featured Creators
            </h2>
            <Link href="/creators">
              <a className="flex items-center gap-2 text-sm md:text-base">
                View more <ArrowRightIcon className="w-5 h-5" />
              </a>
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-8 mt-12 md:grid-cols-2 lg:grid-cols-3">
          <div className="col-span-1">
            <TOTMProfileCard />
          </div>
          <div className="col-span-1">
            <TOTMProfileCard />
          </div>
          <div className="col-span-1">
            <TOTMProfileCard />
          </div>
          <div className="col-span-1">
            <TOTMProfileCard />
          </div>
          <div className="col-span-1">
            <TOTMProfileCard />
          </div>
          <div className="col-span-1">
            <TOTMProfileCard />
          </div>
        </div>
      </div>
      <ListingSection
        title={"Recommended for you"}
        href={"/nfts?group=recommended"}
      >
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="col-span-1">
            <NFTItem />
          </div>
        ))}
      </ListingSection>
      <div className="px-4 my-24 md:px-8 lg:px-0">
        <MagazineBanner />
      </div>
      <ListingSection
        title={"Recently created NFTs"}
        href={"/nfts?group=recent"}
      >
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="col-span-1">
            <NFTItem redeemable={i % 4 === 0} />
          </div>
        ))}
      </ListingSection>
    </>
  );
}
