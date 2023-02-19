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
import Balancer from "react-wrap-balancer";
import Image from "next/image";
import {SEOHead} from "@packages/seo/page";
import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import useEmblaCarousel from "embla-carousel-react";
import {IFeatureProps, request} from "@lib/datocms";

const getTrendingNFTs = async () => {
	const res = await axios.get(`${apiEndpoint}/marketplace/trending`);
	return res.data.data;
};

const getTrendingCreators = async () => {
	const res = await axios.get(`${apiEndpoint}/profile`);
	return res.data.data;
};

export default function Index(props: {allFeatures: Array<IFeatureProps>}) {
	const {theme} = useApplicationTheme();

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
		<Container className="flex flex-col gap-12 md:gap-16 lg:gap-24 py-12 px-4">
			<SEOHead
				title={"TreatDAO"}
				description="TreatDAO is a Web3 project dedicated to creating opportunities and an amazing platform for adult content creators and collectors."
				data={{
					official: true,
				}}
			/>
			<Container>
				<FeaturedCarousel features={props.allFeatures} />
			</Container>
			<Container>
				<Container className="flex flex-col w-full gap-8 px-8  container mx-auto">
					<Container className="flex flex-col items-baseline gap-4">
						<Container className="flex flex-col gap-2">
							<Heading size="sm">Discover sweetshop NFT's</Heading>
							<Text>
								Buy and sell NFTs by TreatDAO content creators and resellers.
							</Text>
						</Container>
						<Link href={"/sweetshop"}>
							<Button appearance={"default"}>
								<ImportantText>View all on sweetshop</ImportantText>
								<ArrowRightIcon
									width={16}
									height={16}
								/>
							</Button>
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
				<Container className="flex flex-col w-full gap-8 px-8  container mx-auto">
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
				<Container className="flex flex-col w-full gap-8 px-4  container mx-auto">
					<Container className="flex flex-col gap-4">
						<Container className="flex flex-col gap-2">
							<Heading size="sm">Discover Treat creators</Heading>
							<Text>
								Meet our content creators, giving you your daily dose of spicy
								content.
							</Text>
						</Container>

						<Link href={"/creators"}>
							<Button appearance={"default"}>
								<ImportantText>View more creators</ImportantText>
								<ArrowRightIcon
									width={16}
									height={16}
								/>
							</Button>
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
				<Container className="flex flex-col w-full gap-8 px-8  container mx-auto">
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
				<Container className="flex flex-col w-full gap-8 px-8  container mx-auto py-24">
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
									<ImportantText css={{color: "$accentText"}}>
										link
									</ImportantText>
								</Link>{" "}
								to buy crypto easily, powered by our friends at{" "}
								<Link
									href={"https://flooz.trade"}
									target={"_blank"}
									rel={"nooopener"}
								>
									https://flooz.trade
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

function FeaturedCarousel(props: {features: Array<IFeatureProps>}) {
	const carouselRef = useRef(null);
	const [scrollPosition, setScrollPosition] = useState(0);

	const isNextEnabled = useMemo(() => {
		if (carouselRef.current) {
			return (
				carouselRef.current.scrollWidth - carouselRef.current.scrollLeft >
				carouselRef.current.clientWidth
			);
		}
		return false;
	}, [scrollPosition, carouselRef]);

	const isPrevEnabled = useMemo(() => {
		if (carouselRef.current) {
			return carouselRef.current.scrollLeft > 0;
		}
		return false;
	}, [scrollPosition, carouselRef]);

	const next = () => {
		carouselRef.current.scrollBy({
			left: 384,
			behavior: "smooth",
		});
		setScrollPosition(carouselRef.current.scrollLeft);
	};

	const prev = () => {
		carouselRef.current.scrollBy({
			left: -384,
			behavior: "smooth",
		});
		setScrollPosition(carouselRef.current.scrollLeft);
	};

	return (
		<Container className="relative container mx-auto flex flex-col gap-8 px-8">
			<Container className="flex flex-col md:flex-row gap-4 justify-between w-full md:items-center">
				<Container>
					<Heading size="sm">Featured on TreatDAO</Heading>
					<Text>
						Discover the hottest content, creators and TreatDAO patners
					</Text>
				</Container>
				<Container className="flex justify-between w-full md:w-fit h-fit md:gap-8">
					<Button
						onClick={prev}
						css={{
							borderRadius: "9999px",
							padding: "0.5rem",
						}}
						appearance={"surface"}
					>
						<CaretLeftIcon className="w-6 h-6" />
					</Button>
					<Button
						onClick={next}
						css={{
							borderRadius: "9999px",
							padding: "0.5rem",
						}}
						appearance={"surface"}
					>
						<CaretRightIcon className="w-6 h-6" />
					</Button>
				</Container>
			</Container>
			<Container
				ref={carouselRef}
				className="@container flex flex-nowrap overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-hide w-full gap-8"
			>
				{props.features.map((feature) => (
					<Link
						href={feature.href}
						key={feature.id}
						className="w-96 group relative aspect-[2/3] flex-shrink-0 bg-gray-50 rounded-xl overflow-hidden"
					>
						<Image
							src={feature.cover.responsiveImage.src}
							sizes={feature.cover.responsiveImage.srcSet}
							alt={feature.displayName}
							className="object-cover rounded-xl"
						/>
						<Container
							css={{
								background:
									"linear-gradient(0deg, #000000 0%, rgba(0, 0, 0, 0) 100%)",
							}}
							className="absolute z-1 top-0 left-0 flex flex-col-reverse w-full h-full p-8 gap-2 group-hover:opacity-100 opacity-0 transition-opacity duration-300 delay-150"
						>
							<Text css={{color: "#f1f1f1"}}>
								{feature.caption ??
									`Some description to make things look much better than having
                                just the title alone because it looks terrible`}
							</Text>
							<Heading
								size="xs"
								css={{color: "#fff"}}
							>
								{feature.displayName}
							</Heading>
						</Container>
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

export async function getServerSideProps(context: any) {
	const data = await request({
		query: FEATURES_QUERY,
	});
	return {
		props: {allFeatures: data.allFeatures},
	};
}
