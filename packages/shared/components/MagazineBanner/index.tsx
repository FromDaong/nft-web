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
      <h4 className="font-medium text-white">
        Wait, we have something for you
      </h4>
      <h2 className="text-3xl font-medium text-white md:text-5xl">
        Treat of the Month
        <br />
        Magazine
      </h2>
      <div className="flex flex-col gap-8 mt-8 md:flex-row">
        <Link href={"/magazine"}>
          <a>
            <Button className="flex items-center justify-center w-full gap-4 text-purple-600 bg-white md:w-auto">
              <span>View magazine</span> <ArrowRightIcon className="w-4 h-4" />
            </Button>
          </a>
        </Link>
        <Link href={"/#"}>
          <a>
            <Button className="flex items-center justify-center w-full gap-4 text-gray-900 bg-white/20 md:w-auto">
              <span>View Ethereum collection</span>{" "}
              <ArrowRightIcon className="w-4 h-4" />
            </Button>
          </a>
        </Link>
      </div>
    </div>
  );
}
