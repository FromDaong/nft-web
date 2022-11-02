import { ArrowRightIcon } from "@heroicons/react/solid";
import ProfileCard from "@packages/shared/components/ProfileCard";
import { Container } from "packages/shared/components/Container";
import Link from "next/link";
import LandingPageHeader from "packages/shared/components/Header";
import ListingSection from "packages/shared/components/ListingSection";
import MagazineBanner from "packages/shared/components/MagazineBanner";
import PostCard from "packages/totm/components/PostCard";
import LandingPageTOTM from "@packages/totm/LandingPageTOTM";

export default function Index() {
  return (
    <Container className="max-w-6xl mx-auto">
      <LandingPageHeader />
      <LandingPageTOTM />
      <div className="px-4 my-24 md:px-8 lg:px-0">
        <MagazineBanner />
      </div>
    </Container>
  );
}
