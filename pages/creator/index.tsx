import Link from "next/link";
import NFTDropdownSort from "packages/navigation/components/NFTDropdownFilter";
import { InfinityScrollListing } from "packages/shared/components/ListingSection";
import ProfileCard from "packages/shared/components/ProfileCard";

export default function NFTS() {
  return (
    <div className="w-full py-8">
      <div className="w-full border-b border-gray-200">
        <div className="flex">
          <p className="px-8 py-4 text-xl font-medium text-pink-600 border-b-4 border-pink-600">
            <Link href={"#"}>
              <a>All creators</a>
            </Link>
          </p>
          <p className="px-8 py-4 text-xl font-medium ">
            <Link href={"/creator/live"}>
              <a>Currently streaming</a>
            </Link>
          </p>
          <p className="px-8 py-4 text-xl font-medium ">
            <Link href={"/creator/subscriptions/"}>
              <a>Subscriptions</a>
            </Link>
          </p>
        </div>
      </div>
      <div className="flex justify-between w-full">
        <div className="flex w-full gap-2 py-8">
          <div>
            <span className="px-4 py-1 text-sm font-medium text-gray-900 bg-gray-100 border-2 border-gray-200 rounded-full cursor-pointer hover:border-pink-600 hover:bg-white">
              Offers subscription
            </span>
          </div>
          <div>
            <span className="px-4 py-1 text-sm font-medium text-gray-900 bg-gray-100 border-2 border-gray-200 rounded-full cursor-pointer hover:border-pink-600 hover:bg-white">
              Treat of The Month
            </span>
          </div>
          <div>
            <span className="px-4 py-1 text-sm font-medium text-gray-900 bg-gray-100 border-2 border-gray-200 rounded-full cursor-pointer hover:border-pink-600 hover:bg-white">
              Following
            </span>
          </div>
          <div>
            <span className="px-4 py-1 text-sm font-medium text-gray-900 bg-gray-100 border-2 border-gray-200 rounded-full cursor-pointer hover:border-pink-600 hover:bg-white">
              Recommended
            </span>
          </div>
        </div>
        <div className="flex items-center flex-1">
          <NFTDropdownSort />
        </div>
      </div>
      <InfinityScrollListing>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
          <div key={i} className="col-span-1">
            <ProfileCard />
          </div>
        ))}
      </InfinityScrollListing>
    </div>
  );
}
