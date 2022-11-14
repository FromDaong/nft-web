import { CurrencyDollarIcon } from "@heroicons/react/outline";
import { styled } from "@styles/theme";
import { CardDetailSection, HeadlessCard } from "..";
import { Button } from "../../Button";
import { ContextualHeading, Text } from "../../Typography/Headings";
import { BoldLink } from "../../Typography/Text";

const VideoContainer = styled("div", {
  height: "55vh",
});

export default function SocialProofCard() {
  return (
    <HeadlessCard>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
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
      <VideoContainer className="flex w-full p-8 mt-4 rounded-xl">
        <div className="flex-1"></div>
        <div className="w-full lg:w-1/3">
          <div className="flex mt-8">
            <div className="flex items-center w-1/2 gap-4">
              <div className="w-12 h-12 bg-purple-100 border-2 border-purple-400 rounded-full"></div>
              <div>
                <p className="text-sm text-gray-400">Creator</p>
                <BoldLink className="font-medium">Cherie Noel</BoldLink>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center w-12 h-12 text-purple-400 border-2 border-purple-400 rounded-full bg-purple-50">
                <CurrencyDollarIcon className="w-12 h-12" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Reserve Price</p>
                <BoldLink className="font-medium">0.90 BNB</BoldLink>
              </div>
            </div>
          </div>
          <div className="w-full mt-8">
            <Button className="flex justify-center w-full text-center text-white bg-purple-600">
              Purchase set for 5.0 BNB
            </Button>
          </div>
        </div>
      </VideoContainer>
    </HeadlessCard>
  );
}
