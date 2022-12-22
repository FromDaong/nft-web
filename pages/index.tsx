/* eslint-disable no-mixed-spaces-and-tabs */
import {Container} from "packages/shared/components/Container";
import FeaturesCard from "@packages/shared/components/Card/MarketingPages/FeaturesCard";
import {BenefitsCard} from "@packages/shared/components/Card/MarketingPages/BenefitsCard";
import Footer from "@packages/shared/components/Footer";
import {Divider, ShortDivider} from "@packages/shared/components/Divider";
import {Heading, Text} from "@packages/shared/components/Typography/Headings";
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
import {useDisclosure} from "@packages/hooks";
import DynamicSkeleton from "@packages/skeleton";
import {
	FeaturedCreatorSkeleton,
	HeadingSkeleton,
} from "@packages/skeleton/config";

// TODO: Use intersection observer to change navbar color.

const getTrendingNFTs = async () => {
	const res = await axios.get(`${apiEndpoint}/marketplace/trending`);
	return res.data.data;
};

const getTrendingCreators = async () => {
	const res = await axios.get(`${apiEndpoint}/profile/`);
	return res.data.data;
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
		queryKey: ["trendingNFTsLanding"],
		queryFn: getTrendingNFTs,
	});

	const totmCurated =
		totmIsLoading || totmError
			? []
			: totmData.data.map((post) => legacy_nft_to_new(post));

	const trendingNFTs =
		totmIsLoading || totmError
			? []
			: trendingNFTsData?.map((post) => legacy_nft_to_new(post));

	return (
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
				<Divider dir={"horizontal"} />
				<Container>
					<Container className="flex flex-col w-full gap-8 px-4 xl:px-0">
						<Container className="flex justify-between">
							<DynamicSkeleton config={HeadingSkeleton} />
							{
								// <Heading size="sm">Discover Treat creators</Heading>
							}
						</Container>
						<Container className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
							{!trendingCreatorError && !trendingCreatorsLoading
								? trendingCreators?.slice(0, 4).map((creator) => (
										<SuggestedCreatorCard
											key={creator._id}
											username={creator.username}
											display_name={creator.profile[0].display_name}
											avatar={creator.profile[0].profile_picture}
											bio={creator.profile[0].bio}
											isExpanded
											border
											live={creator.livestream_active}
											followers={creator.profile[0].followers}
											subscribers={creator.profile[0].following}
										/>
								  ))
								: [0, 1, 2, 4].map((i) => (
										<Container
											key={i}
											className="col-span-1 border"
											css={{
												borderColor: "$subtleBorder",
												padding: "16px",
												borderRadius: "16px",
											}}
										>
											<DynamicSkeleton config={FeaturedCreatorSkeleton} />
										</Container>
								  ))}
						</Container>
					</Container>
				</Container>
				<Divider dir={"horizontal"} />
				<Container>
					<Container className="flex flex-col w-full gap-8 px-8 xl:px-0">
						<Container className="flex flex-col items-baseline justify-between gap-4 md:flex-row">
							<Heading size="sm">Discover sweetshop NFTs</Heading>
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
						<Container className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 lg:gap-4">
							{!trendingNFTError && !trendingNFTsLoading
								? trendingNFTs.map((item, i) => (
										<Container
											key={item}
											className={
												"flex col-span-1 " + (i > 3 ? "lg:hidden xl:flex" : "")
											}
										>
											<TritPost
												inGrid
												{...item}
											/>
										</Container>
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
			</Container>
		</ApplicationFrame>
	);
}
