/* eslint-disable no-mixed-spaces-and-tabs */
import {Container} from "packages/shared/components/Container";
import {Divider} from "@packages/shared/components/Divider";
import {Heading, Text} from "@packages/shared/components/Typography/Headings";
import {TritPost} from "@packages/post/TritPost";
import SuggestedCreatorCard from "@packages/feed/components/SuggestedCreatorCard";
import Link from "next/link";
import {ImportantText} from "@packages/shared/components/Typography/Text";
import {
	ArrowRightIcon,
	FilmIcon,
	MoonIcon,
	PresentationChartLineIcon,
} from "@heroicons/react/outline";
import ApplicationFrame from "core/components/layouts/ApplicationFrame";
import TreatCore from "core/TreatCore";
import axios from "axios";
import {apiEndpoint, legacy_nft_to_new} from "@utils/index";
import DynamicSkeleton from "@packages/skeleton";
import {
	FeaturedCreatorSkeleton,
	TritPostSkeleton,
} from "@packages/skeleton/config";
import {useApplicationTheme} from "@packages/theme/provider";
import {Button} from "@packages/shared/components/Button";
import {MixerVerticalIcon} from "@radix-ui/react-icons";

// T-69 Use intersection observer to change navbar color.

const getTrendingNFTs = async () => {
	const res = await axios.get(`${apiEndpoint}/marketplace/trending`);
	return res.data.data;
};

const getTrendingCreators = async () => {
	const res = await axios.get(`${apiEndpoint}/profile`);
	return res.data.data;
};

const getTOTM = async () => {
	const res = await axios.get(`${apiEndpoint}/marketplace/totm`);
	return res.data;
};

export default function Index() {
	const {theme} = useApplicationTheme();
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

	const LightWidget = () => (
		<div style={{height: "100%", width: "100%"}}>
			<iframe
				src="https://widget.xp.network/connect?widget=true&background=fff&panelBackground=fff&modalBackground=fff&color=14161a&fontSize=16&btnColor=ffffff&btnBackground=395FEB&btnRadius=9&fontFamily=Roboto&chains=Ethereum-BSC-Polygon&from=&to=&cardBackground=1e222d&cardBackgroundBot=1e222d&cardColor=ffffff&cardRadius=25&secondaryColor=0c0d0d&accentColor=3e64ed&borderColor=988b8b&iconColor=3e64ed&tooltipBg=1D212A&tooltipColor=ffffff&wallets=MetaMask-WalletConnect-false&bridgeState=undefined&showLink=false&affiliationFees=1"
				width="100%"
				height="100%"
				id="xpnetWidget"
			/>
		</div>
	);

	const DarkWidget = () => (
		<div style={{height: "100%", width: "100%"}}>
			<iframe
				src="https://widget.xp.network/connect?widget=true&background=1c1c1f&panelBackground=1c1c1f&modalBackground=1c1c1f&color=fff&fontSize=16&btnColor=ffffff&btnBackground=395FEB&btnRadius=9&fontFamily=Roboto&chains=Ethereum-BSC-Polygon&from=&to=&cardBackground=1e222d&cardBackgroundBot=1e222d&cardColor=ffffff&cardRadius=25&secondaryColor=f9f9f9&accentColor=395FEB&borderColor=988b8b&iconColor=3e64ed&tooltipBg=1D212A&tooltipColor=ffffff&wallets=MetaMask-WalletConnect&bridgeState=undefined&showLink=false&affiliationFees=1"
				width="100%"
				height="100%"
				id="xpnetWidget"
			/>
		</div>
	);

	const PinkWidget = () => (
		<div style={{height: "100%", width: "100%"}}>
			<iframe
				src="https://widget.xp.network/connect?widget=true&background=ffeef0&panelBackground=ffeef0&modalBackground=fff&color=14161a&fontSize=16&btnColor=ffffff&btnBackground=395FEB&btnRadius=9&fontFamily=Roboto&chains=Ethereum-BSC-Polygon&from=&to=&cardBackground=1e222d&cardBackgroundBot=1e222d&cardColor=ffffff&cardRadius=25&secondaryColor=0c0d0d&accentColor=3e64ed&borderColor=988b8b&iconColor=3e64ed&tooltipBg=1D212A&tooltipColor=ffffff&wallets=MetaMask-WalletConnect&bridgeState=undefined&showLink=false&affiliationFees=1"
				width="100%"
				height="100%"
				id="xpnetWidget"
			/>
		</div>
	);

	return (
		<Container className="flex flex-col gap-12 md:gap-16 lg:gap-24 py-12">
			<Container>
				<Container className="flex flex-col w-full gap-8 px-8 xl:px-0 container mx-auto">
					<Container className="flex flex-col items-baseline gap-4">
						<Container className="flex flex-col gap-2">
							<Heading size="sm">Discover sweetshop NFT's</Heading>
							<Text>
								Buy and sell NFTs by TreatDAO content creators and resellers.
							</Text>
						</Container>
						<Link href={"/sweetshop"}>
							<a>
								<Button appearance={"default"}>
									<ImportantText>View all on sweetshop</ImportantText>
									<ArrowRightIcon
										width={16}
										height={16}
									/>
								</Button>
							</a>
						</Link>
					</Container>
					<Container className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-4 lg:gap-4">
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
							: [0, 1, 2, 3].map((i) => (
									<Container
										key={i}
										className="col-span-1 border"
										css={{
											borderColor: "$subtleBorder",
											padding: "8px",
											borderRadius: "16px",
										}}
									>
										<DynamicSkeleton config={TritPostSkeleton} />
									</Container>
							  ))}
					</Container>
				</Container>
			</Container>
			<Divider dir={"horizontal"} />
			<Container>
				<Container className="flex flex-col w-full gap-8 px-8 xl:px-0 container mx-auto">
					<Container className="flex flex-col items-baseline gap-4">
						<Container className="flex flex-col gap-2">
							<Heading size="sm">Lots of new features</Heading>
							<Text>
								The new TreatDAO NFTs platform brings a lot of new features to
								enhance your browsing experience.
							</Text>
						</Container>
					</Container>
					<Container className="pt-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 xl:gap-12">
						<Container
							css={{
								backgroundColor: "$accentBg",
								borderRadius: "16px",
							}}
							className="p-8 flex flex-col gap-2"
						>
							<Container className="py-8 flex">
								<Container
									css={{
										backgroundColor: "$accentText",
										padding: "12px",
										borderRadius: "8px",
									}}
								>
									<Text css={{color: "$surface !important"}}>
										<MoonIcon
											width={24}
											height={24}
										/>
									</Text>
								</Container>
							</Container>
							<Heading size="xss">Eye candy</Heading>
							<Text>
								Choose your theme from not only dark and light mode, but also
								including the OG Pink theme.
							</Text>
						</Container>
						<Container
							css={{
								backgroundColor: "$accentBg",
								borderRadius: "16px",
							}}
							className="p-8 flex flex-col gap-2"
						>
							<Container className="py-8 flex">
								<Container
									css={{
										backgroundColor: "$accentText",
										padding: "12px",
										borderRadius: "8px",
									}}
								>
									<Text css={{color: "$surface !important"}}>
										<FilmIcon
											width={24}
											height={24}
										/>
									</Text>
								</Container>
							</Container>
							<Heading size="xss">Image Editor</Heading>
							<Text>
								Now you can edit your NFT images on the platform, with features
								such as filters, color correction and cropping with multiple
								templates preconfigured.
							</Text>
						</Container>
						<Container
							css={{
								backgroundColor: "$accentBg",
								borderRadius: "16px",
							}}
							className="p-8 flex flex-col gap-2"
						>
							<Container className="py-8 flex">
								<Container
									css={{
										backgroundColor: "$accentText",
										padding: "12px",
										borderRadius: "8px",
									}}
								>
									<Text css={{color: "$surface !important"}}>
										<PresentationChartLineIcon
											width={24}
											height={24}
										/>
									</Text>
								</Container>
							</Container>
							<Heading size="xss">Resell your NFTs</Heading>
							<Text>
								Fancy yourself a trade? You can buy and resell your TreatDAO
								NFTs directly on the sweetshop and earn yourself some crypto
							</Text>
						</Container>
						<Container
							css={{
								backgroundColor: "$accentBg",
								borderRadius: "16px",
							}}
							className="p-8 flex flex-col gap-2"
						>
							<Container className="py-8 flex">
								<Container
									css={{
										backgroundColor: "$accentText",
										padding: "12px",
										borderRadius: "8px",
									}}
								>
									<Text css={{color: "$surface !important"}}>
										<MixerVerticalIcon
											width={24}
											height={24}
										/>
									</Text>
								</Container>
							</Container>
							<Heading size="xss">NFT Bridge</Heading>
							<Text>
								We have made it possible for you to bridge your NFTs from
								Binance Smartchain to the Ethereum and Polygon networks.
							</Text>
						</Container>
					</Container>
				</Container>
			</Container>
			<Divider dir={"horizontal"} />
			<Container>
				<Container className="flex flex-col w-full gap-8 px-4 xl:px-0 container mx-auto">
					<Container className="flex flex-col gap-4">
						<Container className="flex flex-col gap-2">
							<Heading size="sm">Discover Treat creators</Heading>
							<Text>
								Meet our content creators, giving you your daily dose of spicy
								content.
							</Text>
						</Container>

						<Link href={"/creators"}>
							<a>
								<Button appearance={"default"}>
									<ImportantText>View more creators</ImportantText>
									<ArrowRightIcon
										width={16}
										height={16}
									/>
								</Button>
							</a>
						</Link>
					</Container>
					<Container className="grid grid-cols-1 gap-8 md:grid-cols-2  xl:grid-cols-4">
						{!trendingCreatorError && !trendingCreatorsLoading
							? trendingCreators?.slice(0, 4).map((creator) => (
									<SuggestedCreatorCard
										key={creator._id}
										username={creator.username}
										display_name={creator.profile?.display_name}
										avatar={creator.profile?.profile_pic}
										bio={creator.profile?.bio}
										isExpanded
										border
										live={creator.livestream_active}
										followers={creator.profile?.followers?.length}
										subscribers={creator.profile?.following?.length}
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
				<Container className="flex flex-col w-full gap-8 px-8 xl:px-0 container mx-auto">
					<Container className="flex flex-col items-baseline gap-4">
						<Container className="flex flex-col gap-2">
							<Heading size="sm">Going multichain</Heading>
							<Text>
								Now you can bridge your TreatDAO NFTs to Ethereum and Polygon
								networks.
							</Text>
						</Container>
					</Container>
					<Container className="pt-4">
						<Container className="flex flex-col gap-8 px-4 xl:px-0 h-[70vh] w-full">
							{theme === "light" && <LightWidget />}
							{theme === "dark" && <DarkWidget />}
							{theme === "pink" && <PinkWidget />}
						</Container>
					</Container>
				</Container>
			</Container>
			<Divider dir="horizontal" />
			<Container>
				<Container className="flex flex-col w-full gap-8 px-8 xl:px-0 container mx-auto py-24">
					<Container className="flex flex-col items-baseline gap-4">
						<Container className="flex flex-col gap-2">
							<Heading size="sm">Frequently asked questions</Heading>
							<Text>
								Common things you need to know about TreatDAO and the NFT
								marketplace
							</Text>
						</Container>
					</Container>
					<Container className="pt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
						<Container className="flex flex-col gap-2">
							<Heading size="xss">What is an NFT?</Heading>
							<Text>
								An NFT, also known as a non-fungible token is a record of proof
								of ownership of a digital asset.
							</Text>
						</Container>
						<Container className="flex flex-col gap-2">
							<Heading size="xss">How do I buy BNB or $TREAT?</Heading>
							<Text>
								You can buy BNB or $TREAT directly from this website. Visit this{" "}
								<Link href={"/dex/ramp"}>
									<a>
										<ImportantText css={{color: "$accentText"}}>
											link
										</ImportantText>
									</a>
								</Link>{" "}
								to buy crypto easily, powered by our friends at{" "}
								<Link href={"https://flooz.trade"}>
									<a
										target={"_blank"}
										rel={"nooopener"}
									>
										https://flooz.trade
									</a>
								</Link>
								.
							</Text>
						</Container>
						<Container className="flex flex-col gap-2">
							<Heading size="xss">Can I become a creator?</Heading>
							<Text>
								Anyone above the legal age can become a creator. We require all
								creators to perform identity verification to guard against
								exploitation and misuse, we also restrict people from creating
								multiple creator profiles.
							</Text>
						</Container>
						<Container className="flex flex-col gap-2">
							<Heading size="xss">Which blockchain is supported</Heading>
							<Text>
								The TreatDAO NFT platform is deployed on the Binance Smart
								Chain, however we fully support bridging NFTs bought on the
								platform, to the Ethereum and Polygon blockchain networks.
							</Text>
						</Container>
					</Container>
				</Container>
			</Container>
		</Container>
	);
}
