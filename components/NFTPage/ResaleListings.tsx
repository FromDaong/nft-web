/* eslint-disable no-mixed-spaces-and-tabs */
import {Tag} from "@packages/post/BuyNFTPageViewNFT";
import {Container} from "@packages/shared/components/Container";
import {Text} from "@packages/shared/components/Typography/Headings";
import {
	ImportantText,
	SmallText,
} from "@packages/shared/components/Typography/Text";
import Spinner from "@packages/shared/icons/Spinner";
import {apiEndpoint, formatAddress} from "@utils/index";
import axios from "axios";
import TreatCore from "core/TreatCore";
import UserAvatar from "core/auth/components/Avatar";
import {AnimatePresence} from "framer-motion";
import {useRouter} from "next/router";
import {useContext, useMemo} from "react";
import {gql, useQuery} from "urql";
import Web3 from "web3";
import {SelectedOrderContext} from "./SelectedOrderContext";
import DynamicSkeleton from "@packages/skeleton";

const resaleTokensQuery = gql`
	query resaleTokens($id: BigInt!) {
		marketItems(where: {nft: $id, isActive: true}) {
			cost
			id
			currentSupply
			maxSupply
			nft
			seller
			timestamp
		}
	}
`;

const useResaleListingsForNFT = (nftId) => {
	const [{data: {marketItems = []} = {}, fetching, error}] = useQuery({
		query: resaleTokensQuery,
		variables: {
			id: `${nftId}`,
		},
		pause: !nftId,
	});

	const {data: sellersData, isLoading: sellersIsLoading} = TreatCore.useQuery(
		["getSellers", nftId],
		async () => {
			const res = await axios.post(`${apiEndpoint}/people/get-by-address`, {
				addresses: marketItems.map((item) => item.seller.toLowerCase()),
			});
			return res.data.data;
		},
		{
			enabled: !fetching && !error && !!marketItems.length,
		}
	);

	const resaleListings = useMemo(() => {
		if (sellersData && !!marketItems.length) {
			return marketItems
				.map((item) => {
					let seller = sellersData.find(
						(seller) =>
							seller.address.toLowerCase() === item.seller.toLowerCase()
					);

					if (!seller)
						seller = {
							address: item.seller,
							username: formatAddress(item.seller),
							profile_pic: "",
						};

					return {
						price: item.cost,
						quantity: item.currentSupply,
						seller,
					};
				})
				.filter((item) => item);
		}
		return [];
	}, [sellersData]);

	return {
		isLoading: fetching,
		resaleListings,
	};
};

const OrderSkeleton = () => (
	<DynamicSkeleton
		config={[
			{
				type: "row",
				height: 2,
				repeat: 4,

				columns: [
					{
						length: 2,
						start: 0,
						radius: 8,
						bg: false,
						rows: [
							{
								type: "row",
								height: 1,
								repeat: 2,
								columns: [
									{
										start: 0,
										length: 2,
										bg: true,
										radius: 4,
									},
								],
							},
							{
								type: "row",
								height: 1,
								repeat: 2,
								columns: [
									{
										start: 0,
										length: 1,
										bg: true,
										radius: 4,
									},
								],
							},
						],
					},
					{
						length: 1,
						start: 4,
						radius: 8,
						bg: true,
					},
				],
			},
		]}
	/>
);

export default function ResaleListings({nft}) {
	const {baseOrder, isLoading: loadingBaseOrder} =
		useContext(SelectedOrderContext);
	const {resaleListings, isLoading} = useResaleListingsForNFT(nft.id);
	const router = useRouter();
	const seller = `${router.query.seller as string}`.toLowerCase();

	const toggleListing = (seller_address: string) =>
		router.push({
			query: {
				...router.query,
				seller: seller_address,
			},
		});

	return (
		<Container className="flex flex-col gap-2 py-4">
			{isLoading && (
				<>
					<Container className="flex justify-center py-4">
						<Text>
							<Spinner />
						</Text>
					</Container>
				</>
			)}

			{loadingBaseOrder ? (
				<OrderSkeleton />
			) : (
				<BaseOrder
					baseOrder={baseOrder}
					nft={nft}
					onClick={toggleListing}
					active={seller === nft.creator.address}
				/>
			)}
			{!isLoading && (
				<>
					{resaleListings.length > 0 && (
						<AnimatePresence>
							<Container className="flex flex-col gap-3">
								{resaleListings.map((listing) => (
									<ResaleListing
										listing={listing}
										key={listing.seller}
										seller={seller}
										onClick={toggleListing}
									/>
								))}
							</Container>
						</AnimatePresence>
					)}
				</>
			)}
		</Container>
	);
}

function ResaleListing({listing, seller, onClick}) {
	if (!listing) return null;

	const select = () => onClick(listing.seller.address.toLowerCase());

	return (
		<Container
			key={listing.seller.address}
			onClick={select}
			className="flex items-center justify-between p-2 transition-all duration-75 shadow cursor-pointer rounded-xl"
			css={{
				"&:hover": {
					backgroundColor: "$elementOnSurface",
					border: "2px solid $purple10",
				},
				border:
					seller === listing.seller.address.toLowerCase()
						? "2px solid $purple10"
						: "2px solid $surfaceOnSurface",
				backgroundColor: "$surfaceOnSurface",
			}}
		>
			<Container className="flex items-center gap-4">
				<UserAvatar
					profile_pic={listing.seller.profile_pic}
					username={listing.seller.username}
					size={32}
				/>
				<Container className="flex flex-col">
					<Text>
						<ImportantText>
							{listing.seller.display_name
								? listing.seller.display_name
								: listing.seller.username}
						</ImportantText>
					</Text>
					<p className="flex gap-2">
						<SmallText>{listing.quantity} available</SmallText>
					</p>
				</Container>
			</Container>
			<Container>
				<Tag>
					{" "}
					{Web3.utils.fromWei(listing.price.toString()).toString()} BNB
				</Tag>
			</Container>
		</Container>
	);
}

function BaseOrder({baseOrder, nft, onClick, active}) {
	const select = () => onClick(nft.creator.address);
	const activeState = {
		backgroundColor: "$accentBg",
		color: "$accentText !important",
		borderColor: "$accentText",
	};
	return (
		<Container
			onClick={select}
			css={
				active
					? activeState
					: {
							backgroundColor: "$elementOnSurface",
							borderColor: "$elementOnSurface",
							"&:hover": activeState,
					  }
			}
			className="flex flex-col gap-4 p-2 transition-all duration-200 border-2 cursor-pointer rounded-xl hover:shadow-xl"
		>
			<Container className="flex items-start">
				<Tag>PRIMARY LISTING</Tag>
			</Container>
			<Container className="flex justify-between">
				<Container className="flex gap-2">
					<UserAvatar
						profile_pic={nft.creator.profile.profile_pic}
						username={nft.creator.username}
						size={32}
					/>
					<Container className="flex flex-col">
						<Text>
							<ImportantText
								css={{
									color: "$textContrast",
								}}
							>
								{nft.creator.display_name
									? nft.creator.display_name
									: nft.creator.username}
							</ImportantText>
						</Text>
						<p className="flex gap-2">
							<SmallText>
								<ImportantText>
									{false &&
										(baseOrder.currentSupply !== 0
											? nft.max_supply - baseOrder.currentSupply
											: 0)}{" "}
								</ImportantText>
							</SmallText>
						</p>
					</Container>
				</Container>
				<Container>
					<Tag>{nft.price} BNB</Tag>
				</Container>
			</Container>
		</Container>
	);
}
