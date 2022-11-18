import { Container } from "packages/shared/components/Container";
import LandingPageHeader from "packages/shared/components/Header";
import FeaturesCard from "@packages/shared/components/Card/MarketingPages/FeaturesCard";
import MonthlyMagazine from "@packages/shared/components/Card/MarketingPages/MonthlyMagazineCard";
import SubscriptionsCard from "@packages/shared/components/Card/MarketingPages/SubscriptionsCard";
import SmartContracts from "@packages/shared/components/Card/MarketingPages/SmartContractsCard";
import { BenefitsCard } from "@packages/shared/components/Card/MarketingPages/BenefitsCard";
import Footer from "@packages/shared/components/Footer";
import { ShortDivider } from "@packages/shared/components/Divider";
import TreatOfTheMonth from "@packages/shared/components/Card/MarketingPages/TreatOfTheMonth";
import { styled } from "@styles/theme";
import { ReactNode } from "react";

// TODO: Use intersection observer to change navbar color.

const ThemedContainer = styled(Container, {
  padding: "64px 0",

  variants: {
    state: {
      normal: {
        backgroundColor: "$surface",
      },
      invert: {
        backgroundColor: "$textContrast",
      },
    },
  },

  defaultVariants: {
    state: "normal",
  },
});

const FluidContainer = ({
  className,
  children,
  state,
}: {
  className?: string;
  children: ReactNode;
  state?: "invert" | "normal";
}) => {
  return (
    <ThemedContainer state={state}>
      <div className={className}>{children}</div>
    </ThemedContainer>
  );
};

const maxWFluid = "max-w-6xl mx-auto";

export default function Index() {
  return (
    <>
      <>
        <LandingPageHeader />
        <FluidContainer state={"normal"} className={maxWFluid}>
          <div className="my-12 md:px-8 lg:px-0">
            <TreatOfTheMonth />
          </div>
        </FluidContainer>

        <FluidContainer className={maxWFluid}>
          <div className="grid grid-cols-2 gap-8 px-4 my-24 md:px-8 lg:px-0">
            <div className="col-span-2 px-4 mb-12 md:px-8 lg:px-0">
              <FeaturesCard />
            </div>

            <BenefitsCard
              title={"Connect with all your favorite creators."}
              user_type="FAN"
              description={
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur, ultrices mauris."
              }
            />
            <BenefitsCard
              title={"Unlimited tools to monetize your content."}
              user_type="CREATOR"
              description={
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur, ultrices mauris."
              }
            />
          </div>
          <div className="px-4 my-24 md:px-8 lg:px-0">
            <SubscriptionsCard />
          </div>
        </FluidContainer>
        <ShortDivider dir={"vertical"} />
        <FluidContainer className={`${maxWFluid}`}>
          <div className="px-4 my-12 md:px-8 lg:px-0">
            <MonthlyMagazine />
          </div>
        </FluidContainer>

        <ShortDivider dir={"vertical"} />
        <FluidContainer className={maxWFluid}>
          <div className="px-4 my-24 md:px-8 lg:px-0">
            <SmartContracts />
          </div>
        </FluidContainer>
      </>
      <div className="px-4 my-24 md:px-8 lg:px-0">
        <Footer />
      </div>
    </>
  );
}
