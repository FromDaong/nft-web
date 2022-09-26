import { ArrowRightIcon } from "@heroicons/react/solid";
import Link from "next/link";
import { Button } from "../Button";

export default function MagazineBanner() {
  return (
    <div
      style={{
        background: "linear-gradient(290.55deg, #DEB5FF 0%, #6F00B3 100%)",
      }}
      className="flex flex-col w-full gap-8 px-12 py-24 bg-gray-900 shadow-sm rounded-xl"
    >
      <h4 className="text-xl font-medium text-white">
        Wait, we have something for you
      </h4>
      <h2 className="text-5xl font-bold text-white">
        Treat of the Month
        <br />
        Magazine
      </h2>
      <div className="flex gap-8 mt-8">
        <Link href={"/magazine"}>
          <a>
            <Button className="flex items-center gap-4 text-purple-600 bg-white">
              <span>View magazine</span> <ArrowRightIcon className="w-4 h-4" />
            </Button>
          </a>
        </Link>
        <Link href={"/#"}>
          <a>
            <Button className="flex items-center gap-4 text-gray-900 bg-white">
              <span>View Ethereum collection</span>{" "}
              <ArrowRightIcon className="w-4 h-4" />
            </Button>
          </a>
        </Link>
      </div>
    </div>
  );
}
