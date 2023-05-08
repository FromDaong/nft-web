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
import {
	CaretLeftIcon,
	CaretRightIcon,
	MixerVerticalIcon,
} from "@radix-ui/react-icons";
import Image from "next/future/image";
import {SEOHead} from "@packages/seo/page";
import {useMemo, useRef, useState} from "react";
import {IFeatureProps, request} from "@lib/datocms";
import Balancer from "react-wrap-balancer";

const getTrendingNFTs = async () => {
	const res = await axios.get(`${apiEndpoint}/marketplace/trending`);
	return res.data.data;
};

const getTrendingCreators = async () => {
	const res = await axios.get(`${apiEndpoint}/profile`);
	return res.data.data;
};

export default function Index(props: {
	allFeatures: Array<IFeatureProps>;
	allFeaturesError?: boolean;
}) {
	const {theme} = useApplicationTheme();
	const {allFeaturesError} = props;

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

	const trendingNFTs =
		trendingNFTsLoading || trendingNFTError
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
		<>
			<Container
				css={{
					background: "$surfaceOnSurface",
					backgroundSize: "cover",
					backgroundPosition: "top",
				}}
				className={"py-24 flex flex-col gap-24"}
			>
				<Container className="container relative flex flex-col gap-12 px-8 mx-auto">
					<Container className="flex flex-col items-center max-w-screen-sm gap-12 py-12 mx-auto text-center lg:gap-16">
						<Container className={"flex justify-center"}>
							<Link href={"/magazines"}>
								<a>
									<Container
										css={{
											backgroundColor: "$accentBg",
											borderColor: "$subtleBorder",
										}}
										className={
											"rounded-full hidden lg:flex font-semibold shadow-sm gap-2 p-2 border"
										}
									>
										<Text
											css={{color: "$accentText"}}
											className={
												"px-4 flex items-center font-semibold truncate ... max-w-screen-sm"
											}
										>
											Read the latest TreatDAO Magazine
											<ArrowRightIcon className={"w-4 h-4 ml-4"} />
										</Text>
									</Container>
								</a>
							</Link>
						</Container>
						<Container
							className={"flex flex-col gap-4 items-center text-center"}
						>
							<Balancer>
								<Heading>Welcome to our renewed Adult NFT Marketplace</Heading>
							</Balancer>
							<Balancer>
								<Text css={{fontSize: "1.5rem", lineHeight: "2rem"}}>
									Support content creators, join the DAO, hold the token, and
									much more!
								</Text>
							</Balancer>
						</Container>
						<Container className={"flex gap-4 justify-center "}>
							<Button appearance={"primary"}>
								Visit the sweetshop <ArrowRightIcon className={"w-5 h-5"} />{" "}
							</Button>
							<Button
								appearance={"subtle"}
								outlined
							>
								Buy $TREAT
							</Button>
						</Container>
					</Container>
				</Container>
				<Container>
					{!allFeaturesError && (
						<FeaturedCarousel features={props.allFeatures} />
					)}
				</Container>
			</Container>
			<Container className="flex flex-col gap-12 py-12 mt-12 md:gap-16 lg:gap-24">
				<SEOHead
					title={"TreatDAO"}
					description="TreatDAO is a Web3 project dedicated to creating opportunities and an amazing platform for adult content creators and collectors."
					data={{
						official: true,
					}}
				/>
				<Container>
					<Container className="container flex flex-col w-full gap-8 px-8 mx-auto">
						<Container className="flex flex-col items-baseline gap-4">
							<Container className="flex flex-col gap-2">
								<Heading>Discover sweetshop NFT's</Heading>
								<Text>
									Buy and sell NFTs by TreatDAO content creators and resellers.
								</Text>
							</Container>
							<Link href={"/sweetshop"}>
								<a>
									<Button
										outlined
										appearance={"subtle"}
									>
										<ImportantText>View all on sweetshop</ImportantText>
										<ArrowRightIcon
											width={16}
											height={16}
										/>
									</Button>
								</a>
							</Link>
						</Container>
						{!trendingNFTError && (
							<Container className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-4 lg:gap-4">
								{!trendingNFTError && !trendingNFTsLoading
									? trendingNFTs.map((item, i) => (
											<Container
												key={item}
												className={
													"flex col-span-1 " +
													(i > 3 ? "lg:hidden xl:flex" : "")
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
						)}
						{trendingNFTError && (
							<Container className={"flex justify-center"}>
								<p>An error occurred while fetching NFTs</p>
							</Container>
						)}
					</Container>
				</Container>
				<Divider dir={"horizontal"} />
				<Container>
					<Container className="container flex flex-col w-full gap-8 px-8 mx-auto">
						<Container className="flex flex-col items-baseline gap-4">
							<Container className="flex flex-col gap-2">
								<Heading>Lots of new features</Heading>
								<Text>
									The new TreatDAO NFTs platform brings a lot of new features to
									enhance your browsing experience.
								</Text>
							</Container>
						</Container>
						<Container className="grid grid-cols-1 pt-4 gap-y-8 xl:gap-y-12">
							<Container
								className={
									"col-span-1 md:col-span-2 grid grid-cols-1 gap-8 md:grid-cols-2"
								}
							>
								<FeaturesCard
									backgroundImage={"/assets/backgrounds/mockups/themes.svg"}
									title={"Eye candy"}
									description={`Choose your theme from not only dark and light mode, but also including the OG Pink theme.`}
									icon={
										<MoonIcon
											width={24}
											height={24}
										/>
									}
									cols={1}
									action={<Button appearance={"primary"}>Try it out</Button>}
								/>

								<FeaturesCard
									backgroundImage={"/assets/backgrounds/mockups/nft_bridge.svg"}
									title={"NFT Bridge"}
									description={`We have made it possible for you to bridge your NFTs from
								Binance Smartchain to the Ethereum and Polygon networks.`}
									cols={1}
									icon={
										<MixerVerticalIcon
											width={24}
											height={24}
										/>
									}
									action={
										<Button appearance={"primary"}>Bridge your nfts</Button>
									}
								/>
							</Container>

							<FeaturesCard
								backgroundImage={"/assets/backgrounds/mockups/image_editor.svg"}
								title={"Image editing tools"}
								description={`Now you can edit your NFT images on the platform, with features
								such as filters, color correction and cropping with multiple
								templates preconfigured.`}
								icon={
									<FilmIcon
										width={24}
										height={24}
									/>
								}
								cols={1}
								action={
									<Button appearance={"primary"}>
										Create an NFT <ArrowRightIcon className="w-4 h-4" />
									</Button>
								}
							/>
						</Container>
					</Container>
				</Container>
				<Divider dir={"horizontal"} />
				<Container>
					<Container className="container flex flex-col w-full gap-8 px-4 mx-auto">
						<Container className="flex flex-col gap-4">
							<Container className="flex flex-col gap-2">
								<Heading>Discover Treat creators</Heading>
								<Text>
									Meet our content creators, giving you your daily dose of spicy
									content.
								</Text>
							</Container>

							<Link href={"/creators"}>
								<a>
									<Button
										outlined
										appearance={"subtle"}
									>
										<ImportantText>View more creators</ImportantText>
										<ArrowRightIcon
											width={16}
											height={16}
										/>
									</Button>
								</a>
							</Link>
						</Container>
						<Container className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-4">
							{!trendingCreatorError && !trendingCreatorsLoading
								? trendingCreators?.slice(0, 8).map((creator) => (
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
					<Container className="container flex flex-col w-full gap-8 px-8 mx-auto">
						<Container className="flex flex-col items-baseline gap-4">
							<Container className="flex flex-col gap-2">
								<Heading>Going multichain</Heading>
								<Text>
									Now you can bridge your TreatDAO NFTs to Ethereum and Polygon
									networks.
								</Text>
							</Container>
						</Container>
						<Container className="pt-4">
							<Container className="flex flex-col gap-8 px-4  h-[70vh] w-full">
								{theme === "light" && <LightWidget />}
								{theme === "dark" && <DarkWidget />}
								{theme === "pink" && <PinkWidget />}
							</Container>
						</Container>
					</Container>
				</Container>
				<Divider dir="horizontal" />
				<Container>
					<Container className="container flex flex-col w-full gap-8 px-8 py-24 mx-auto">
						<Container className="flex flex-col items-baseline gap-4">
							<Container className="flex flex-col gap-2">
								<Heading>Frequently asked questions</Heading>
								<Text>
									Common things you need to know about TreatDAO and the NFT
									marketplace
								</Text>
							</Container>
						</Container>
						<Container className="grid grid-cols-1 gap-12 pt-4 md:grid-cols-2 lg:grid-cols-4">
							<Container className="flex flex-col gap-2">
								<Heading size="xss">What is an NFT?</Heading>
								<Text>
									An NFT, also known as a non-fungible token is a record of
									proof of ownership of a digital asset.
								</Text>
							</Container>
							<Container className="flex flex-col gap-2">
								<Heading size="xss">How do I buy BNB or $TREAT?</Heading>
								<Text>
									You can buy BNB or $TREAT directly from this website. Visit
									this{" "}
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
									Anyone above the legal age can become a creator. We require
									all creators to perform identity verification to guard against
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
		</>
	);
}

function FeaturedCarousel(props: {features: Array<IFeatureProps>}) {
	return (
		<Container className="container relative flex flex-col gap-8 px-8 mx-auto">
			<Container className="grid w-full grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-4">
				{props.features.slice(0, 4).map((feature) => (
					<Link
						href={feature.href}
						key={feature.id}
					>
						<a className="w-full max-w-96 group relative aspect-[2/3] flex-shrink-0 bg-transparent rounded-xl overflow-hidden shadow-lg">
							<Image
								src={feature.cover.responsiveImage.src}
								sizes={feature.cover.responsiveImage.srcSet}
								alt={feature.displayName}
								fill
								className="object-cover"
							/>
							<Container
								css={{
									background:
										"linear-gradient(0deg, #000000 0%, rgba(0, 0, 0, 0) 100%)",
								}}
								className="absolute top-0 left-0 flex flex-col-reverse w-full h-full gap-2 p-8 transition-opacity duration-300 delay-150 opacity-0 z-1 group-hover:opacity-100"
							>
								<Heading
									size={"xs"}
									css={{color: "#f1f1f1"}}
								>
									{feature.caption ??
										`Some description to make things look much better than having
									just the title alone because it looks terrible`}
								</Heading>
								<Heading
									size="sm"
									css={{color: "#fff"}}
									className={"tracking-tighter"}
								>
									{feature.displayName}
								</Heading>
							</Container>
						</a>
					</Link>
				))}
			</Container>
		</Container>
	);
}

const FEATURES_QUERY = `{
   allFeatures {
    id
    href
    displayName
	caption
    cover {
      responsiveImage {
        srcSet
        webpSrcSet
        sizes
        src
        width
        height
        aspectRatio
        alt
        title
        bgColor
        base64
      }
    }
  }
}`;

export async function getServerSideProps() {
	try {
		const data = await request({
			query: FEATURES_QUERY,
		});
		return {
			props: {allFeatures: data.allFeatures},
		};
	} catch (err) {
		console.warn(err);
		return {
			props: {
				allFeaturesError: true,
			},
		};
	}
}

function FeaturesCard({
	title,
	description,
	icon,
	cols,
	action,
	backgroundImage,
}) {
	return (
		<Container
			className={`col-span-${cols} overflow-hidden gap-2 flex flex-col xl:flex-row min-h-96 relative shadow border border-white lg:pb-0`}
			css={{
				backgroundColor: "$surfaceOnSurface",
				borderRadius: "16px",
				borderColor: "$border",
			}}
		>
			<Container className="relative z-10 flex flex-col w-full gap-12 p-8 xl:max-w-sm">
				<Container className="grid gap-4">
					<Container className="relative z-10 flex py-4">
						<Container
							css={{
								backgroundColor: "$accentText",
								padding: "4px",
								borderRadius: "8px",
							}}
						>
							<Text
								css={{
									color: "$surface !important",
								}}
							>
								{icon}
							</Text>
						</Container>
					</Container>
					<div className="relative">
						<Heading size="xs">{title}</Heading>
					</div>
					<Text className="relative">{description}</Text>
				</Container>
				<Container>{action}</Container>
			</Container>
			<Container className="relative flex flex-1 h-full overflow-visible min-h-48">
				<Container
					css={{
						backgroundImage: `url("${backgroundImage}")`,
						backgroundPosition: "center right",
						backgroundRepeat: "no-repeat",
						backgroundSize: "contain",
					}}
					className="w-full h-full"
				/>
			</Container>
		</Container>
	);
}
