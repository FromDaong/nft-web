import { ArrowRightIcon } from "@heroicons/react/solid";
import ProfileCard from "@packages/shared/components/ProfileCard";
import { Container } from "packages/shared/components/Container";
import Link from "next/link";
import LandingPageHeader from "packages/shared/components/Header";
import ListingSection from "packages/shared/components/ListingSection";
import MagazineBanner from "packages/shared/components/MagazineBanner";
import PostCard from "packages/totm/components/PostCard";
import LandingPageTOTM from "@packages/totm/LandingPageTOTM";
import FeaturesCard from "@packages/shared/components/Card/MarketingPages/FeaturesCard";
import MonthlyMagazine from "@packages/shared/components/Card/MarketingPages/MonthlyMagazineCard";
import SubscriptionsCard from "@packages/shared/components/Card/MarketingPages/SubscriptionsCard";
import SmartContracts from "@packages/shared/components/Card/MarketingPages/SmartContractsCard";
import { BenefitsCard } from "@packages/shared/components/Card/MarketingPages/BenefitsCard";
import Footer from "@packages/shared/components/Footer";
import { Divider, ShortDivider } from "@packages/shared/components/Divider";

export default function Index() {
  return (
    <>
      <Container className="max-w-6xl mx-auto">
        <LandingPageHeader />
        <ShortDivider dir={"vertical"} />
        <div className="px-4 my-32 md:px-8 lg:px-0">
          <MonthlyMagazine />
        </div>
        <ShortDivider dir={"vertical"} />

        <LandingPageTOTM />
        <div className="grid grid-cols-2 gap-8 px-4 my-24 md:px-8 lg:px-0">
          <div className="col-span-2 px-4 mb-8 md:px-8 lg:px-0">
            <FeaturesCard />
          </div>

          <BenefitsCard
            title={"Connect with all your favorite creators."}
            user_type="FAN"
            image={""}
            description={
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur, ultrices mauris."
            }
          />
          <BenefitsCard
            title={"Unlimited tools to monetize your content."}
            user_type="CREATOR"
            image={""}
            description={
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur, ultrices mauris."
            }
          />
        </div>
        <div className="px-4 my-24 md:px-8 lg:px-0">
          <SubscriptionsCard />
        </div>
        <ShortDivider dir={"vertical"} />
        <div className="px-4 my-24 md:px-8 lg:px-0">
          <SmartContracts />
        </div>
      </Container>
      <div className="px-4 my-24 md:px-8 lg:px-0">
        <Footer />
      </div>
    </>
  );
}
