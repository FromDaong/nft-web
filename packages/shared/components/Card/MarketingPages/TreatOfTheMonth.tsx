import { CurrencyDollarIcon } from "@heroicons/react/outline";
import { styled } from "@styles/theme";
import { CardDetailSection, HeadlessCard } from "..";
import { Button } from "../../Button";
import { ContextualHeading, Text } from "../../Typography/Headings";
import { BoldLink } from "../../Typography/Text";

const VideoContainer = styled("div", {
  height: "65vh",
});

export default function TreatOfTheMonth() {
  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          width: "100%",
        }}
        className="mx-auto text-center"
      >
        <CardDetailSection>
          <ContextualHeading>
            Meet our September Treat of The Month
          </ContextualHeading>
          <Text>
            TreatDAO is a community owned project built to life easier for
            content creators.
          </Text>
        </CardDetailSection>
      </div>
      <VideoContainer className="grid w-full grid-cols-5 gap-8 p-8 mt-4 rounded-xl">
        <div className="flex-1 col-span-5 bg-gray-100 lg:col-span-3 rounded-xl"></div>
        <div className="col-span-5 lg:col-span-2">
          <div className="flex mt-8">
            <div className="flex items-center w-1/2 gap-4">
              <div className="w-12 h-12 bg-gray-100 rounded-full"></div>
              <div>
                <p>Creator</p>
                <BoldLink className="font-medium">Cherie Noel</BoldLink>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center w-12 h-12">
                <CurrencyDollarIcon className="w-12 h-12" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Reserve Price</p>
                <BoldLink className="font-medium">0.90 BNB</BoldLink>
              </div>
            </div>
          </div>
          <div className="w-full mt-8">
            <Button className="flex justify-center w-full text-center">
              Purchase set for 5.0 BNB
            </Button>
          </div>
        </div>
      </VideoContainer>
    </>
  );
}
