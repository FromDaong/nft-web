/* eslint-disable no-mixed-spaces-and-tabs */
import {Container} from "packages/shared/components/Container";
import {Divider} from "@packages/shared/components/Divider";
import {Heading, Text} from "@packages/shared/components/Typography/Headings";
import {TritPost} from "@packages/post/TritPost";
import SuggestedCreatorCard from "@packages/feed/components/SuggestedCreatorCard";
import Link from "next/link";
import {ImportantText} from "@packages/shared/components/Typography/Text";
import {ArrowRightIcon} from "@heroicons/react/outline";
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

// TODO: Use intersection observer to change navbar color.

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
				src="https://widget.xp.network/connect?widget=true&background=fff&panelBackground=fff&modalBackground=fff&color=14161a&fontSize=16&btnColor=ffffff&btnBackground=395FEB&btnRadius=9&fontFamily=Roboto&chains=Moonbeam-Ethereum-Godwoken-Polygon-VeChain-BSC-Avalanche-Harmony-Aurora-Tron-Algorand-Tezos-Elrond-Fantom-Gnosis-GateChain-Iotex-Velas-Fuse-Abeychain-Internet Computer-Hedera-Secret-Cardano&from=&to=&cardBackground=1e222d&cardBackgroundBot=1e222d&cardColor=ffffff&cardRadius=25&secondaryColor=0c0d0d&accentColor=3e64ed&borderColor=988b8b&iconColor=3e64ed&tooltipBg=1D212A&tooltipColor=ffffff&wallets=MetaMask-BitKeep-WalletConnect-TrustWallet-MyAlgo-AlgoSigner-TronLink-Maiar-Beacon-TempleWallet-MaiarExtension-Sync2-VeChainThor-Sync2-VeChainThor-TronLink-MyAlgo-AlgoSigner-Beacon-TempleWallet-Maiar-MaiarExtension-Keplr&bridgeState=undefined&showLink=false&affiliationFees=1"
				width="100%"
				height="100%"
				id="xpnetWidget"
			/>
		</div>
	);

	const DarkWidget = () => (
		<div style={{height: "100%", width: "100%"}}>
			<iframe
				src="https://widget.xp.network/connect?widget=true&background=1c1c1f&panelBackground=1c1c1f&modalBackground=1c1c1f&color=fff&fontSize=16&btnColor=ffffff&btnBackground=395FEB&btnRadius=9&fontFamily=Roboto&chains=Moonbeam-Ethereum-Godwoken-Polygon-VeChain-BSC-Avalanche-Harmony-Aurora-Tron-Algorand-Tezos-Elrond-Fantom-Gnosis-GateChain-Iotex-Velas-Fuse-Abeychain-Internet Computer-Hedera-Secret-Cardano&from=&to=&cardBackground=1e222d&cardBackgroundBot=1e222d&cardColor=ffffff&cardRadius=25&secondaryColor=f9f9f9&accentColor=395FEB&borderColor=988b8b&iconColor=3e64ed&tooltipBg=1D212A&tooltipColor=ffffff&wallets=MetaMask-BitKeep-WalletConnect-TrustWallet-MyAlgo-AlgoSigner-TronLink-Maiar-Beacon-TempleWallet-MaiarExtension-Sync2-VeChainThor-Sync2-VeChainThor-TronLink-MyAlgo-AlgoSigner-Beacon-TempleWallet-Maiar-MaiarExtension-Keplr&bridgeState=undefined&showLink=false&affiliationFees=1"
				width="100%"
				height="100%"
				id="xpnetWidget"
			/>
		</div>
	);

	const PinkWidget = () => (
		<div style={{height: "100%", width: "100%"}}>
			<iframe
				src="https://widget.xp.network/connect?widget=true&background=ffeef0&panelBackground=ffeef0&modalBackground=fff&color=14161a&fontSize=16&btnColor=ffffff&btnBackground=395FEB&btnRadius=9&fontFamily=Roboto&chains=Moonbeam-Ethereum-Godwoken-Polygon-VeChain-BSC-Avalanche-Harmony-Aurora-Tron-Algorand-Tezos-Elrond-Fantom-Gnosis-GateChain-Iotex-Velas-Fuse-Abeychain-Internet Computer-Hedera-Secret-Cardano&from=&to=&cardBackground=1e222d&cardBackgroundBot=1e222d&cardColor=ffffff&cardRadius=25&secondaryColor=0c0d0d&accentColor=3e64ed&borderColor=988b8b&iconColor=3e64ed&tooltipBg=1D212A&tooltipColor=ffffff&wallets=MetaMask-BitKeep-WalletConnect-TrustWallet-MyAlgo-AlgoSigner-TronLink-Maiar-Beacon-TempleWallet-MaiarExtension-Sync2-VeChainThor-Sync2-VeChainThor-TronLink-MyAlgo-AlgoSigner-Beacon-TempleWallet-Maiar-MaiarExtension-Keplr&bridgeState=undefined&showLink=false&affiliationFees=1"
				width="100%"
				height="100%"
				id="xpnetWidget"
			/>
		</div>
	);

	return (
		<ApplicationFrame>
			<Container className="flex flex-col gap-12 px-2 md:gap-16 lg:gap-24">
				<Container className="pt-4">
					<Container className="flex flex-col gap-8 px-4 xl:px-0 h-[70vh] w-full">
						{theme === "light" && <LightWidget />}
						{theme === "dark" && <DarkWidget />}
						{theme === "pink" && <PinkWidget />}
					</Container>
				</Container>
				<Container>
					<Container className="flex flex-col w-full gap-8 px-4 xl:px-0">
						<Container className="flex justify-between">
							<Heading size="sm">Discover Treat creators</Heading>
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
											<DynamicSkeleton config={TritPostSkeleton} />
										</Container>
								  ))}
						</Container>
					</Container>
				</Container>
			</Container>
		</ApplicationFrame>
	);
}
