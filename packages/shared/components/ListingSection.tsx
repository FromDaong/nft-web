import { ArrowRightIcon } from "@heroicons/react/solid";
import Link from "next/link";

export default function ListingSection({ title, href, children }) {
  return (
    <div className="my-24">
      <div className="w-full">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
          <Link href={href}>
            <a className="flex items-center gap-2">
              View more <ArrowRightIcon className="w-5 h-5" />
            </a>
          </Link>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-8 mt-12">{children}</div>
    </div>
  );
}
