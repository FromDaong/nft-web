import { ArrowRightIcon } from "@heroicons/react/solid";
import { Button } from "../Button";

export default function LandingPageHeader() {
  return (
    <div className="flex items-center justify-center w-full p-8 py-12 lg:py-24">
      <div className="flex flex-col max-w-3xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 lg:text-8xl">
            Its time to <br />
            treat yourself
          </h1>
          <p className="justify-center max-w-lg mx-auto mt-12">
            Treat is an open platform for creators to curate their adult content
            as NFTs. Hold the $TREAT token to have a say in the future of the
            only NSFW platform that focuses on decentralization first and
            foremost
          </p>

          <div className="flex items-center justify-center max-w-lg gap-8 mt-12">
            <Button className="text-white bg-pink-600">View Sweetshop</Button>
            <Button className="gap-4 bg-pink-50">
              Buy $TREAT <ArrowRightIcon className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
