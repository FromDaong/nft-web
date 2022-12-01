import {
	Container,
	PublicFluidContainer,
} from "packages/shared/components/Container";
import LandingPageHeader from "packages/shared/components/Header";
import FeaturesCard from "@packages/shared/components/Card/MarketingPages/FeaturesCard";
import MonthlyMagazine from "@packages/shared/components/Card/MarketingPages/MonthlyMagazineCard";
import SubscriptionsCard from "@packages/shared/components/Card/MarketingPages/SubscriptionsCard";
import SmartContracts from "@packages/shared/components/Card/MarketingPages/SmartContractsCard";
import {BenefitsCard} from "@packages/shared/components/Card/MarketingPages/BenefitsCard";
import Footer from "@packages/shared/components/Footer";
import {ShortDivider} from "@packages/shared/components/Divider";
import TreatOfTheMonth from "@packages/shared/components/Card/MarketingPages/TreatOfTheMonth";
import {Heading, Text} from "@packages/shared/components/Typography/Headings";
import {Button} from "@packages/shared/components/Button";
import {TPost} from "@packages/post/types";
import {CuratedNFt} from "@packages/post/CuratedPost";
import SuggestedCreatorCard from "@packages/feed/components/SuggestedCreatorCard";
import Link from "next/link";

// TODO: Use intersection observer to change navbar color.

const newCurated: TPost = {
	name: "Welcome to the Tritters",
	collection: {
		name: "Tritters",
		totalSupply: 10,
		minted: 4,
		avatar: "/assets/cherieCover.jpg",
	},
	/*image: {
    cdn: "/assets/cherieCover.jpg",
    ipfs: "/assets/cherieCover.jpg",
  },*/
	price: {
		value: 0.99,
		currency: "BNB",
	},
	id: "1",
	blurhash:
		"-qIFGCoMs:WBayay_NRjayj[ayj[IUWBayayj[fQIUt7j[ayayayj@WBRjoffkj[xuWBWCayj[ayWAt7fQj[ayayM{WBofj[j[fQ",
	post_type: "colletible",
	author: {
		username: "kamfeskaya",
		display_name: "Kamfes",
		live: true,
		avatar:
			"https://images.pexels.com/users/avatars/50964441/feyza-yildirim-157.jpeg?auto=compress&fit=crop&h=50&w=50&dpr=1",
	},
	timestamp: 782898893,
};

export default function Index() {
	return (
		<>
			<>
				<LandingPageHeader />
				<PublicFluidContainer state={"normal"}>
					<Container className="my-12 md:px-8 lg:px-0">
						<TreatOfTheMonth />
					</Container>
				</PublicFluidContainer>
				<PublicFluidContainer>
					<Container className="flex flex-col w-full gap-8">
						<Container className="flex justify-between">
							<Heading size="md">Trending creators</Heading>
						</Container>
						<Container className="grid grid-cols-3 gap-8">
							{["kamfeska", "putinih", "khaks"].map((i) => (
								<SuggestedCreatorCard
									key={i}
									username={i}
									display_name="Tatenda Chris"
									avatar=""
									bio="Mystery SEV. Suddenly, the site goes dark. The dashboard is red. Everything seems fucked. There's no indication why."
									isExpanded
									border
									live={i === "putinih"}
								/>
							))}
						</Container>
					</Container>
				</PublicFluidContainer>
				<ShortDivider dir={"vertical"} />
				<PublicFluidContainer>
					<Container className="flex flex-col w-full gap-8">
						<Container className="flex justify-between">
							<Heading size="md">Trending trits</Heading>
							<Link href={"/sweetshop"}>
								<a>
									<Text>View all on sweetshop</Text>
								</a>
							</Link>
						</Container>
						<Container className="grid grid-cols-3 gap-4">
							{[1, 2, 3].map((i) => (
								<CuratedNFt
									key={i}
									inGrid
									{...newCurated}
								/>
							))}
						</Container>
					</Container>
				</PublicFluidContainer>
				<ShortDivider dir={"vertical"} />
				<PublicFluidContainer>
					<div className="grid grid-cols-2 gap-8 px-4 md:px-8 lg:px-0">
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
