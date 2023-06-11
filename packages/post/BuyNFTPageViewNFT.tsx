import AddToWishlist from "@components/MarketPlace/Details/Modals/AddToWishlist";
import ShowAllCollectors from "@components/MarketPlace/Details/Modals/Collectors";
import ShareModal from "@components/NFTPage/modals/ShareNFTModal";
import {TiptapPreview} from "@components/ui/tiptap";
import AvatarGroup from "@packages/avatars/AvatarGroup";
import {useDisclosure} from "@packages/hooks";
import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import {Heading, Text} from "@packages/shared/components/Typography/Headings";
import {
	ImportantText,
	SmallText,
} from "@packages/shared/components/Typography/Text";
import {ABI} from "@packages/treat/lib/abi";
import {contractAddresses} from "@packages/treat/lib/treat-contracts-constants";
import {StarFilledIcon} from "@radix-ui/react-icons";
import {apiEndpoint} from "@utils/index";
import axios from "axios";
import TreatCore from "core/TreatCore";
import UserAvatar from "core/auth/components/Avatar";
import {useWishlist} from "core/auth/components/TreatBalancesProvider";
import {Share2Icon, StarIcon} from "lucide-react";
import Link from "next/link";
import {useEffect, useMemo, useState} from "react";
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

const NFTPresentationComponent = (props: {nft: any; address: string}) => {
	const {nft} = props;
	const {collectors, isLoading} = useGetCollectors(nft.id);
	const {
		isLoading: wishListLoading,
		addToWishlist,
		removeFromWishlist,
		isWishlisted,
		wishlist,
	} = useWishlist(nft._id);

	const description = useMemo(() => {
		if (typeof nft.description === "string") {
			return JSON.parse(nft.description);
		}
		return nft.description;
	}, [nft]);

	const {
		isOpen: isWishlistModalOpen,
		onOpen: onOpenWishlistModal,
		onClose: onCloseWishlistModal,
	} = useDisclosure();

	const {
		isOpen: isShareModalOpen,
		onOpen: onOpenShareModal,
		onClose: onCloseShareModal,
	} = useDisclosure();

	const {
		isOpen: isCollectorsModalOpen,
		onOpen: onOpenCollectorsModal,
		onClose: onCloseCollectorsModal,
	} = useDisclosure();

	const addOrRemoveFromWishlist = () => {
		if (isWishlisted) return removeFromWishlist();
		if (!isWishlisted) return addToWishlist();
	};

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
			<ShareModal
				isOpen={isShareModalOpen}
				onClose={onCloseShareModal}
			/>
			<Container className="flex flex-col gap-12 lg:gap-16 lg:flex">
				<Container className="flex flex-col gap-8">
					<Container
						className={"flex md:flex-col flex-col gap-6 md:gap-2 pb-4"}
					>
						<Heading
							size={"sm"}
							className="tracking-tighter"
						>
							{nft.name}
						</Heading>
						<Container className="flex flex-col md:flex-row gap-4 justify-between md:items-center py-2">
							<Link href={`/${nft.creator.username}`}>
								<a className="flex items-center gap-2">
									<UserAvatar
										size={40}
										username={nft.creator.username}
										profile_pic={nft.creator.profile.profile_pic}
									/>
									<Container className="flex flex-col">
										<Text css={{color: "$textContrast"}}>
											<ImportantText>
												{nft.creator.profile.display_name?.trim() === ""
													? `${nft.creator.username}`
													: nft.creator.profile.display_name}
											</ImportantText>
										</Text>
										<Text>@{nft.creator.username}</Text>
									</Container>
								</a>
							</Link>
							<Container className="flex gap-4">
								{(!wishListLoading || !wishlist) && (
									<Button
										appearance={isWishlisted ? "accent" : "surface"}
										onClick={addOrRemoveFromWishlist}
									>
										{!isWishlisted && (
											<>
												<StarIcon className="w-5 h-5" />
												Add to wishlist
											</>
										)}
										{isWishlisted && (
											<>
												<StarFilledIcon className="w-5 h-5" />
												Wishlisted
											</>
										)}
									</Button>
								)}
								<Button
									onClick={onOpenShareModal}
									appearance={"surface"}
								>
									<Share2Icon className="w-5 h-5" />
									Share
								</Button>
							</Container>
						</Container>
					</Container>
					<Container className="flex flex-col col-span-2 gap-4 md:col-span-1">
						{!!nft.description && (
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
					{(isLoading || collectors?.length !== 0) && (
						<Container className="flex flex-wrap gap-4">
							<Container className="flex flex-col gap-2">
								<Heading size={"xss"}>Owners</Heading>
								<Container className="flex items-center w-fit">
									{!isLoading && (
										<>
											<AvatarGroup
												size={32}
												users={collectors.slice(0, 5).map((c) => ({
													name: c.username,
													imageUrl: c.profile_pic,
													href: `/${c.username}`,
												}))}
											/>
											{collectors.length > 5 && (
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
											)}
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
					)}
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
										<Tag>{tag}</Tag>
									</a>
								</Link>
							))}
							<Tag>NFT</Tag>
						</Container>
					</Container>
				</Container>
			</Container>
		</>
	);
};

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
				<ImportantText className="pink:text-gray-700 dark:text-gray-200">
					{children ?? name}
				</ImportantText>
			</SmallText>
		</Container>
	);
}

export default NFTPresentationComponent;
