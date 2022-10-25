import Link from "next/link";
import NFTDropdownSort from "packages/navigation/components/NFTDropdownFilter";
import { InfinityScrollListing } from "packages/shared/components/ListingSection";
import NFTItem from "packages/shared/components/NFTItem";

export default function NFTS() {
  return (
    <div className="w-full py-8">
      <div className="w-full border-b border-gray-200">
        <div className="flex">
          <p className="px-8 py-4 text-xl font-medium text-blue-600 border-b-4 border-blue-600">
            <Link href={"#"}>
              <a>Listed NFTs</a>
            </Link>
          </p>
          <p className="px-8 py-4 text-xl font-medium ">
            <Link href={"/nft/resale"}>
              <a>Resale NFTs</a>
            </Link>
          </p>
        </div>
      </div>
      <div className="flex justify-between w-full">
        <div className="flex w-full gap-2 py-8">
          <div>
            <span className="px-4 py-1 text-sm font-medium text-gray-900 bg-gray-100 border-2 border-gray-200 rounded-full cursor-pointer hover:border-blue-600 hover:bg-white">
              Free
            </span>
          </div>
          <div>
            <span className="px-4 py-1 text-sm font-medium text-gray-900 bg-gray-100 border-2 border-gray-200 rounded-full cursor-pointer hover:border-blue-600 hover:bg-white">
              Rare
            </span>
          </div>
          <div>
            <span className="px-4 py-1 text-sm font-medium text-gray-900 bg-gray-100 border-2 border-gray-200 rounded-full cursor-pointer hover:border-blue-600 hover:bg-white">
              Treat of The Month
            </span>
          </div>
          <div>
            <span className="px-4 py-1 text-sm font-medium text-gray-900 bg-gray-100 border-2 border-gray-200 rounded-full cursor-pointer hover:border-blue-600 hover:bg-white">
              Following
            </span>
          </div>
          <div>
            <span className="px-4 py-1 text-sm font-medium text-gray-900 bg-gray-100 border-2 border-gray-200 rounded-full cursor-pointer hover:border-blue-600 hover:bg-white">
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
            <NFTItem />
          </div>
        ))}
      </InfinityScrollListing>
    </div>
  );
}
