import AddToWishlist from "@components/MarketPlace/Details/Modals/AddToWishlist";
import ShowAllCollectors from "@components/MarketPlace/Details/Modals/Collectors";
import {TiptapPreview} from "@components/ui/tiptap";
import {HeartIcon} from "@heroicons/react/outline";
import AvatarGroup from "@packages/avatars/AvatarGroup";
import {useWagmiGetCreatorNftCost} from "@packages/chain/hooks";
import {useDisclosure} from "@packages/hooks";
import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import {Heading, Text} from "@packages/shared/components/Typography/Headings";
import {
	ImportantText,
	SmallText,
} from "@packages/shared/components/Typography/Text";
import {useCopyToClipboard} from "@packages/shared/hooks";
import {ABI} from "@packages/treat/lib/abi";
import {contractAddresses} from "@packages/treat/lib/treat-contracts-constants";
import {apiEndpoint} from "@utils/index";
import axios from "axios";
import TreatCore from "core/TreatCore";
import {CopyIcon, StarIcon} from "lucide-react";
import Link from "next/link";
import {useRouter} from "next/router";
import {useEffect, useMemo, useState} from "react";
import {toast} from "react-hot-toast";
import {useContract, useSigner} from "wagmi";

const useGetCollectors = (nftId) => {
	const [isLoading, setIsLoading] = useState(true);
	const [collectors, setCollectors] = useState([]);

	const {
		data: collectorsData,
		isLoading: collectorsIsLoading,
		refetch,
	} = TreatCore.useQuery(
		["getCollectors", nftId],
		async () => {
			const res = await axios.post(`${apiEndpoint}/people/get-by-address`, {
				addresses: collectors.map((item) => item.owner_of),
			});
			return res.data.data;
		},
		{
			enabled: !isLoading,
		}
	);

	// fetch the collectors from moralis api
	useEffect(() => {
		const getCollectors = async () => {
			try {
				const res = await fetch(
					`https://deep-index.moralis.io/api/v2/nft/${contractAddresses.treatNFTMinter[56]}/${nftId}/owners?chain=bsc&format=decimal&disable_total=false`,
					{
						headers: {
							"X-API-Key": process.env.NEXT_PUBLIC_MORALIS_API_KEY,
						},
					}
				);
				const data: {
					total: number;
					result: {
						token_id: string;
						owner_of: string;
						amount: string;
					}[];
				} = await res.json();
				setCollectors(
					data.result.map((item) => ({
						token_id: item.token_id,
						owner_of: item.owner_of,
						amount: item.amount,
					}))
				);
				refetch();
				setIsLoading(false);
			} catch (error) {
				console.log(error);
			}
		};
		getCollectors();
	}, [nftId]);

	return {collectors: collectorsData, isLoading: collectorsIsLoading};
};

export const useTreatResaleMarket = () => {
	const {data} = useSigner();

	const treatResaleMarket = useContract({
		addressOrName: contractAddresses.treatResaleMarketplaceMinter[56],
		contractInterface: ABI.treatMarketplace,
		signerOrProvider: data,
	});

	const treatResaleMarketReader = useContract({
		addressOrName: contractAddresses.treatMarketReader[56],
		contractInterface: ABI.treatMarketReader,
		signerOrProvider: data,
	});

	return {
		treatResaleMarket,
		treatResaleMarketReader,
	};
};

export const useGetResaleListings = (nftId: number) => {
	const [isLoading, setIsLoading] = useState(true);
	const [resaleOrders, setResaleListings] = useState({
		sellers: [],
		prices: [],
		quantitys: [],
	});
	const {treatResaleMarketReader} = useTreatResaleMarket();

	const {data: sellersData, isLoading: sellersIsLoading} = TreatCore.useQuery(
		["getSellers", nftId],
		async () => {
			const res = await axios.post(`${apiEndpoint}/people/get-by-address`, {
				addresses: resaleOrders.sellers.map((item) => item),
			});
			return res.data.data;
		},
		{
			enabled: !isLoading,
		}
	);

	useEffect(() => {
		setIsLoading(true);
		const getResaleListingsSellers = async () => {
			try {
				const orders = await treatResaleMarketReader.readAllOrdersForNft(nftId);

				setResaleListings({...orders});
				setIsLoading(false);
			} catch (error) {
				console.log(error);
			}
		};
		getResaleListingsSellers();
	}, [nftId]);

	const resaleListings = useMemo(() => {
		if (sellersData && resaleOrders) {
			return resaleOrders.sellers
				.map((seller_addr, index) => {
					const seller = sellersData.find(
						(item) => item.address.toLowerCase() === seller_addr.toLowerCase()
					);

					if (!seller) return null;

					return {
						price: resaleOrders.prices[index],
						quantity: resaleOrders.quantitys[index],
						seller,
					};
				})
				.filter((item) => item);
		}
		return [];
	}, [sellersData]);

	return {
		isLoading: sellersIsLoading || isLoading,
		resaleListings,
	};
};

const NFTPresentationComponent = (props: {
	nft: any;
	isOwned: boolean;
	balance: number;
	loadHD: () => void;
	openFullScreen: () => void;
	address: string;
	isResale: boolean;
	maxSupply: number;
}) => {
	const {nft} = props;
	const {collectors, isLoading} = useGetCollectors(nft.id);
	const [value, copy] = useCopyToClipboard();
	const router = useRouter();

	const description = useMemo(() => {
		if (typeof nft.description === "string") {
			return JSON.parse(nft.description);
		}
		return nft.description;
	}, [nft]);

	const copyURL = () => {
		copy(`${process.env.NEXT_PUBLIC_HOSTNAME}${router.asPath}`);
		toast.success("Copied to clipboard");
	};

	const like = () => {
		toast.success("Added to favorites");
	};

	const {
		isOpen: isWishlistModalOpen,
		onOpen: onOpenWishlistModal,
		onClose: onCloseWishlistModal,
	} = useDisclosure();

	const {
		isOpen: isCollectorsModalOpen,
		onOpen: onOpenCollectorsModal,
		onClose: onCloseCollectorsModal,
	} = useDisclosure();

	return (
		<>
			<AddToWishlist
				isOpen={isWishlistModalOpen}
				onClose={onCloseWishlistModal}
			/>
			{!isLoading && (
				<ShowAllCollectors
					isOpen={isCollectorsModalOpen}
					onClose={onCloseCollectorsModal}
					collectors={collectors}
				/>
			)}
			<Container className="flex flex-col gap-12 py-8 lg:gap-16 lg:flex">
				<Container className="flex flex-col gap-8">
					<Container
						className={"flex md:flex-col flex-col-reverse gap-6 md:gap-1"}
					>
						<Heading
							size={"sm"}
							className="tracking-tighter"
						>
							{nft.name}
						</Heading>
						<Container className="flex flex-col md:flex-row gap-2 justify-between md:items-center">
							<Link href={`/${nft.creator.username}`}>
								<a>
									<Container className="flex gap-2">
										<Text>Created by</Text>
										<Text
											css={{color: "$textContrast"}}
											className="underline"
										>
											<ImportantText>
												{nft.creator.profile.display_name?.trim() === ""
													? `@${nft.creator.username}`
													: nft.creator.profile.display_name}
											</ImportantText>
										</Text>
									</Container>
								</a>
							</Link>
							<Container className="flex gap-4">
								<Button
									appearance={"surface"}
									onClick={like}
								>
									<StarIcon className="w-5 h-5" />
									Favorite
								</Button>
								<Button
									onClick={copyURL}
									appearance={"surface"}
								>
									<CopyIcon className="w-5 h-5" />
									Copy link
								</Button>
							</Container>
						</Container>
					</Container>
					<Container className="flex flex-wrap gap-4">
						<Container className="flex flex-col gap-2">
							<Heading
								appearance={"mute"}
								size={"xss"}
							>
								Owned by
							</Heading>
							<Container className="flex items-center w-fit">
								{!isLoading && (
									<>
										<AvatarGroup
											size={32}
											users={collectors.slice(0, 5).map((c) => ({
												name: c.username,
												imageUrl: c.profile_pic,
												href: c.username,
											}))}
										/>
										<Container className="flex gap-2">
											<Button
												appearance={"link"}
												size={"sm"}
												onClick={onOpenCollectorsModal}
											>
												{collectors.length > 5
													? `+${collectors.length - 5} more`
													: "View all"}
											</Button>
										</Container>
									</>
								)}
								{isLoading && (
									<Container
										className="flex py-3 w-32 rounded-xl"
										css={{
											backgroundColor: "$elementOnSurface",
										}}
									/>
								)}
							</Container>
						</Container>
					</Container>
				</Container>

				<Container className="flex flex-col col-span-2 gap-4 md:col-span-1">
					{nft.description && (
						<Container className="flex flex-col gap-2">
							<Heading
								className="tracking-tighter"
								size="xss"
							>
								Description
							</Heading>
							<TiptapPreview value={description} />
						</Container>
					)}
				</Container>

				<Container className="flex flex-col col-span-2 gap-2 md:col-span-1">
					<Heading
						className="tracking-tighter"
						size="xss"
					>
						Tags
					</Heading>
					<Container className="flex flex-wrap gap-4 py-2">
						{nft.tags?.map((tag) => (
							<Link
								href={`/sweetshop/tag/${tag}`}
								key={tag}
							>
								<a>
									<Container
										className="px-3 py-1 rounded-full"
										css={{
											backgroundColor: "$surfaceOnSurface",
										}}
									>
										<Text>
											<ImportantText>{tag}</ImportantText>
										</Text>
									</Container>
								</a>
							</Link>
						))}
						<Tag>NFT</Tag>
					</Container>
				</Container>
			</Container>
		</>
	);
};

export default NFTPresentationComponent;

export function Tag({children}) {
	return (
		<Container
			className="px-3 py-1 border rounded-full shadow-sm"
			css={{
				backgroundColor: "$surfaceOnSurface",
				borderColor: "$border",
			}}
		>
			<SmallText>
				<ImportantText>{children ?? name}</ImportantText>
			</SmallText>
		</Container>
	);
}

function Stat({title, value}) {
	return (
		<Container
			className="flex flex-col items-baseline overflow-hidden border rounded-lg shadow-sm"
			css={{
				borderColor: "$border",
			}}
		>
			<SmallText
				className="tracking-tighter"
				css={{
					backgroundColor: "$surface",
					padding: "0.5rem",
				}}
			>
				<ImportantText>{title}</ImportantText>
			</SmallText>
			<Heading
				className="w-full tracking-tighter text-center"
				css={{
					backgroundColor: "$surfaceOnSurface",
					padding: "0.5rem",
				}}
				size="xs"
			>
				{value}
			</Heading>
		</Container>
	);
}

function Collector({nft}) {
	return (
		<Container className="flex flex-col col-span-2 gap-2">
			<Heading
				appearance={"mute"}
				size={"xss"}
			>
				Collection
			</Heading>
			<Container
				css={{backgroundColor: "$surfaceOnSurface"}}
				className="flex flex-wrap justify-between gap-4 shadow rounded-xl w-fit"
			>
				<Container className="flex items-center gap-4 p-2 pr-4">
					<img
						src={nft.creator.profile.profile_pic}
						alt={"Collection name"}
						className="object-cover w-20 rounded-xl aspect-square"
					/>
					<Container className="flex flex-col gap-2">
						<Heading size={"xss"}>The Killer Collection</Heading>
						<Container className={"flex gap-2"}>
							<AvatarGroup
								users={[
									{
										name: "Tatenda",
										imageUrl: nft.creator.profile.profile_pic,
										href: nft.creator.username,
									},
									{
										name: "Tatenda",
										imageUrl: nft.creator.profile.profile_pic,
										href: nft.creator.username,
									},
									{
										name: "Tatenda",
										imageUrl: nft.creator.profile.profile_pic,
										href: nft.creator.username,
									},
									{
										name: "Tatenda",
										imageUrl: nft.creator.profile.profile_pic,
										href: nft.creator.username,
									},
								]}
							/>
						</Container>
					</Container>
				</Container>
			</Container>
		</Container>
	);
}
