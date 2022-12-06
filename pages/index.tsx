/* eslint-disable no-mixed-spaces-and-tabs */
import {Container} from "packages/shared/components/Container";
import LandingPageHeader from "packages/shared/components/Header";
import FeaturesCard from "@packages/shared/components/Card/MarketingPages/FeaturesCard";
import {BenefitsCard} from "@packages/shared/components/Card/MarketingPages/BenefitsCard";
import Footer from "@packages/shared/components/Footer";
import {ShortDivider} from "@packages/shared/components/Divider";
import {Heading, Text} from "@packages/shared/components/Typography/Headings";
import {TPost} from "@packages/post/types";
import {SkeletonTritCollectiblePost, TritPost} from "@packages/post/TritPost";
import SuggestedCreatorCard, {
	SkeletonExpandedSuggestedCreatorCard,
} from "@packages/feed/components/SuggestedCreatorCard";
import Link from "next/link";
import {ImportantText} from "@packages/shared/components/Typography/Text";
import {ArrowRightIcon} from "@heroicons/react/outline";
import TreatOfTheMonthCollectionSection from "@packages/post/CollectionSection";
import ApplicationFrame from "core/components/layouts/ApplicationFrame";
import ApplicationLayout from "core/components/layouts/ApplicationLayout";
import TreatCore from "core/TreatCore";
import axios from "axios";
import {apiEndpoint, legacy_nft_to_new} from "@utils/index";

// TODO: Use intersection observer to change navbar color.

const getTrendingNFTs = async () => {
	const res = await axios.get(`${apiEndpoint}/marketplace`);
	return res.data;
};

const getTrendingCreators = async () => {
	const res = await axios.get(`${apiEndpoint}/profile`);
	return res.data;
};

const getTOTM = async () => {
	const res = await axios.get(`${apiEndpoint}/marketplace/totm`);
	return res.data;
};

export default function Index() {
	const {
		isLoading: totmIsLoading,
		error: totmError,
		data: totmData,
	} = TreatCore.useQuery({queryKey: ["treatOfTheMonth"], queryFn: getTOTM});

	const {
		isLoading: trendingCreatorsLoading,
		error: trendingCreatorError,
		data: trendingCreators,
	} = TreatCore.useQuery({
		queryKey: ["trendingCreators"],
		queryFn: getTrendingCreators,
	});

	const {
		isLoading: trendingNFTsLoading,
		error: trendingNFTError,
		data: trendingNFTsData,
	} = TreatCore.useQuery({
		queryKey: ["trendingNFTs"],
		queryFn: getTrendingNFTs,
	});

	const totmCurated =
		totmIsLoading || totmError
			? []
			: totmData.data.map((post) => legacy_nft_to_new(post));

	const trendingNFTs =
		totmIsLoading || totmError
			? []
			: trendingNFTsData?.data
					.slice(0, 3)
					.map((post) => legacy_nft_to_new(post));

	return (
		<ApplicationLayout>
			{
				<ApplicationFrame>
					<Container className="flex flex-col gap-12 px-2 md:gap-16 lg:gap-24">
						<Container className="pt-12">
							<Container className="flex flex-col gap-8 px-4 xl:px-0">
								{
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
								}
							</Container>
						</Container>
						<Container>
							<Container className="flex flex-col w-full gap-8 px-4 xl:px-0">
								<Container className="flex justify-between">
									<Heading size="md">Trending creators</Heading>
								</Container>
								<Container className="grid grid-cols-1 gap-8 lg:grid-cols-3">
									{!trendingCreatorError && !trendingCreatorsLoading
										? trendingCreators.data.slice(0, 3).map((creator) => (
												<SuggestedCreatorCard
													key={creator._id}
													username={creator.username}
													display_name={creator.display_name}
													avatar={creator.profile_picture}
													bio={creator.bio}
													isExpanded
													border
													live={creator.livestream_active}
													followers={creator.followers}
													subscribers={creator.following}
												/>
										  ))
										: [0, 1, 2].map((i) => (
												<Container
													key={i}
													className="col-span-1 border"
													css={{
														borderColor: "$subtleBorder",
														padding: "16px",
														borderRadius: "16px",
													}}
												>
													<SkeletonExpandedSuggestedCreatorCard />
												</Container>
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
									{!trendingNFTError && !trendingNFTsLoading
										? trendingNFTs.map((item) => (
												<TritPost
													key={item}
													inGrid
													{...item}
												/>
										  ))
										: [0, 1, 2].map((i) => (
												<Container
													key={i}
													className="col-span-1 border"
													css={{
														borderColor: "$subtleBorder",
														padding: "8px",
														borderRadius: "16px",
													}}
												>
													<SkeletonTritCollectiblePost />
												</Container>
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
			}
			<Container className="pb-12">
				<Footer />
			</Container>
		</ApplicationLayout>
	);
}
