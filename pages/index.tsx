import { PublicFluidContainer } from "packages/shared/components/Container";
import LandingPageHeader from "packages/shared/components/Header";
import FeaturesCard from "@packages/shared/components/Card/MarketingPages/FeaturesCard";
import MonthlyMagazine from "@packages/shared/components/Card/MarketingPages/MonthlyMagazineCard";
import SubscriptionsCard from "@packages/shared/components/Card/MarketingPages/SubscriptionsCard";
import SmartContracts from "@packages/shared/components/Card/MarketingPages/SmartContractsCard";
import { BenefitsCard } from "@packages/shared/components/Card/MarketingPages/BenefitsCard";
import Footer from "@packages/shared/components/Footer";
import { ShortDivider } from "@packages/shared/components/Divider";
import TreatOfTheMonth from "@packages/shared/components/Card/MarketingPages/TreatOfTheMonth";

// TODO: Use intersection observer to change navbar color.

export default function Index() {
  return (
    <>
      <>
        <LandingPageHeader />
        <PublicFluidContainer state={"normal"}>
          <div className="my-12 md:px-8 lg:px-0">
            <TreatOfTheMonth />
          </div>
        </PublicFluidContainer>

        <PublicFluidContainer>
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
        </PublicFluidContainer>
        <ShortDivider dir={"vertical"} />
        <PublicFluidContainer>
          <div className="px-4 my-12 md:px-8 lg:px-0">
            <MonthlyMagazine />
          </div>
        </PublicFluidContainer>

        <ShortDivider dir={"vertical"} />
        <PublicFluidContainer>
          <div className="px-4 my-24 md:px-8 lg:px-0">
            <SmartContracts />
          </div>
        </PublicFluidContainer>
      </>
      <div className="px-4 my-24 md:px-8 lg:px-0">
        <Footer />
      </div>
    </>
  );
}
