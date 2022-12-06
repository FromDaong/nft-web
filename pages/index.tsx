/* eslint-disable no-mixed-spaces-and-tabs */
import {Container} from "packages/shared/components/Container";
import LandingPageHeader from "packages/shared/components/Header";
import FeaturesCard from "@packages/shared/components/Card/MarketingPages/FeaturesCard";
import {BenefitsCard} from "@packages/shared/components/Card/MarketingPages/BenefitsCard";
import Footer from "@packages/shared/components/Footer";
import {ShortDivider} from "@packages/shared/components/Divider";
import {Heading, Text} from "@packages/shared/components/Typography/Headings";
import {TPost} from "@packages/post/types";
import {TritPost} from "@packages/post/TritPost";
import SuggestedCreatorCard from "@packages/feed/components/SuggestedCreatorCard";
import Link from "next/link";
import {ImportantText} from "@packages/shared/components/Typography/Text";
import {ArrowRightIcon} from "@heroicons/react/outline";
import TreatOfTheMonthCollectionSection from "@packages/post/CollectionSection";
import ApplicationFrame from "core/components/layouts/ApplicationFrame";
import ApplicationLayout from "core/components/layouts/ApplicationLayout";
import TreatCore from "core/TreatCore";

// TODO: Use intersection observer to change navbar color.

const newCurated: TPost = {
	name: "Welcome to the Tritters",
	collection: {
		name: "Tritters",
		totalSupply: 10,
		minted: 4,
		avatar: "/assets/cherieCover.jpg",
	},
	image: {
		cdn: "/assets/cherieCover.jpg",
		ipfs: "/assets/cherieCover.jpg",
	},
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
	const {
		isLoading: totmIsLoading,
		error: totmError,
		data: totmData,
	} = TreatCore.useQuery("totm", () =>
		fetch("/api/v3/marketplace/totm").then((res) => res.json())
	);

	const totmCurated =
		totmIsLoading || totmError
			? []
			: totmData.data.map((post) => ({
					name: post.name,
					image: {
						cdn: post.daoCdnUrl,
						ipfs: post.image,
					},
					price: {
						value: post.list_price,
						currency: "BNB",
					},
					id: post.id,
					blurhash:
						post.blurhash ||
						"-qIFGCoMs:WBayay_NRjayj[ayj[IUWBayayj[fQIUt7j[ayayayj@WBRjoffkj[xuWBWCayj[ayWAt7fQj[ayayM{WBofj[j[fQ",
					post_type: "colletible",
					author: {
						username: post.model_handle,
						display_name: post.model_name,
						live: true,
						avatar: post.model_profile_picture,
					},
					collection: {
						name: post.collection_name,
						totalSupply: Number(post.max_supply),
						minted: post.mints?.length,
						avatar: post.collection_avatar,
					},
					tags: post.tags,
			  }));

	return (
		<ApplicationLayout>
			<ApplicationFrame>
				<Container className="flex flex-col gap-12 px-2 md:gap-16 lg:gap-24">
					<Container className="pt-12">
						<Container className="flex flex-col gap-8 px-4 xl:px-0">
							<TreatOfTheMonthCollectionSection
								title={"Treat of the Month"}
								author={[
									{
										username: "treatdaoofficial",
										display_name: "TreatDAO",
									},
									{
										username: "elizarosewatson",
										display_name: "Eliza Rose Watson",
									},
								]}
								collectionItems={totmCurated}
							/>
						</Container>
					</Container>
					<Container>
						<Container className="flex flex-col w-full gap-8 px-4 xl:px-0">
							<Container className="flex justify-between">
								<Heading size="md">Trending creators</Heading>
							</Container>
							<Container className="grid grid-cols-1 gap-8 lg:grid-cols-3">
								{["kamfeska", "putinih", "khaks"].map((i) => (
									<SuggestedCreatorCard
										key={i}
										username={i}
										display_name="Tatenda Chris"
										avatar=""
										bio="Mystery SEV. Suddenly, the site goes dark. The dashboard is red. Everything seems fucked. There's no indication why."
										isExpanded
										border
										isPromoted={i === "putinih"}
										live={i === "putinih"}
									/>
								))}
							</Container>
						</Container>
					</Container>
					<ShortDivider dir={"vertical"} />
					<Container>
						<Container className="flex flex-col w-full gap-8 px-8 xl:px-0">
							<Container className="flex flex-col items-baseline justify-between gap-4 md:flex-row">
								<Heading size="md">Trending trits</Heading>
								<Link href={"/sweetshop"}>
									<a>
										<Text className="flex items-center gap-2">
											<ImportantText>View all on sweetshop</ImportantText>
											<ArrowRightIcon
												width={16}
												height={16}
											/>
										</Text>
									</a>
								</Link>
							</Container>
							<Container className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-4">
								{[1, 2, 3].map((i) => (
									<TritPost
										key={i}
										inGrid
										{...newCurated}
									/>
								))}
							</Container>
						</Container>
					</Container>
					<ShortDivider dir={"vertical"} />
					<Container>
						<Container className="grid grid-cols-1 gap-8 px-4 lg:grid-cols-2 md:px-8 xl:px-0">
							<Container className="col-span-1 px-4 mb-12 lg:col-span-2 md:px-8 xl:px-0">
								<FeaturesCard />
							</Container>
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
						</Container>
					</Container>
				</Container>
			</ApplicationFrame>
			<Container className="pb-12">
				<Footer />
			</Container>
		</ApplicationLayout>
	);
}
