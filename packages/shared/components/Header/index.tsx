import { ArrowRightIcon } from "@heroicons/react/solid";
import { Container } from "core/components";
import { Button } from "../Button";
import { BoldLink } from "../Typography/Text";

export default function LandingPageHeader() {
  return (
    <div
      className="flex items-center justify-center w-full p-4 md:p-8 py-12 lg:py-24 min-h-[80vh]"
      style={{
        // background: "url('/assets/hero-background.svg')",
        backgroundPosition: "center",
        backgroundSize: "contain",
      }}
    >
      <Container>
        <div className="relative flex flex-col justify-center w-full max-w-3xl mx-auto">
          <div
            className="absolute inset-0 w-full h-full"
            style={{
              borderRadius: "10%",
              transform: "scale(1.3)",
              zIndex: "0",
              background:
                "radial-gradient(50% 50% at 50% 50%, #FFFFFF 0%, #FFFFFF 76.04%, rgba(255, 255, 255, 0) 100%)",
              filter: "blur(12px)",
            }}
          />
          <div
            className="flex flex-col items-center text-center"
            style={{ zIndex: "2" }}
          >
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 md:text-6xl lg:text-8xl">
              Spicy content. Directly from the Creators
            </h1>
            <p className="justify-center mx-auto mt-12 text-xl">
              Treat is an open platform for creators to curate their adult
              content as NFTs. Hold the $TREAT token to have a say in the future
              of the only NSFW platform that focuses on decentralization first
              and foremost
            </p>

            <div className="flex items-center justify-center max-w-lg gap-8 mt-12">
              <Button>
                Start exploring content{" "}
                <ArrowRightIcon
                  style={{
                    width: "1.2rem",
                    height: "1.2rem",
                    marginLeft: "0.5rem",
                  }}
                />
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
