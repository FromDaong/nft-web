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
      <div className="px-4S md:px-8 lg:px-0">
        <SubscriptionsCard />
      </div>
      <div className="px-4 my-24 md:px-8 lg:px-0">
        <Footer />
      </div>
    </>
  );
}
