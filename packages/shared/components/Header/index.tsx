import { ArrowRightIcon } from "@heroicons/react/solid";
import { Container } from "core/components";
import { Button } from "../Button";

export default function LandingPageHeader() {
  return (
    <div
      className="flex items-center justify-center w-full p-4 md:p-8 py-12 lg:py-24 min-h-[80vh]"
      style={{
        background: "url('/assets/hero-background.svg')",
        backgroundPosition: "center",
        backgroundSize: "contain",
      }}
    >
      <Container>
        <div className="flex flex-col justify-center w-full max-w-3xl mx-auto">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-4xl font-bold tracking-tighter text-gray-900 md:text-6xl lg:text-8xl">
              Spicy content. Directly from the Creators
            </h1>
            <p className="justify-center mx-auto mt-12 text-xl">
              Treat is an open platform for creators to curate their adult
              content as NFTs. Hold the $TREAT token to have a say in the future
              of the only NSFW platform that focuses on decentralization first
              and foremost
            </p>

            <div className="flex items-center justify-center max-w-lg gap-8 mt-12">
              <Button className="text-white bg-pink-600">
                Discover content
              </Button>
              <Button className="gap-4 text-pink-600 bg-white border-2 border-pink-500">
                Buy $TREAT <ArrowRightIcon className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
