import {Tag} from "@packages/post/BuyNFTPageViewNFT";
import {Container} from "@packages/shared/components/Container";
import {Text} from "@packages/shared/components/Typography/Headings";
import {ImportantText} from "@packages/shared/components/Typography/Text";
import Spinner from "@packages/shared/icons/Spinner";
import {apiEndpoint} from "@utils/index";
import axios from "axios";
import TreatCore from "core/TreatCore";
import UserAvatar from "core/auth/components/Avatar";
import {AnimatePresence} from "framer-motion";
import {useRouter} from "next/router";
import {useMemo} from "react";
import {gql, useQuery} from "urql";
import Web3 from "web3";
import {ResaleItemWithBuy} from "./BuyModals/Resale";

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
					const seller = sellersData.find(
						(seller) =>
							seller.address.toLowerCase() === item.seller.toLowerCase()
					);

					if (!seller) return null;

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

export default function ResaleListings({nft}) {
	const {resaleListings, isLoading} = useResaleListingsForNFT(nft.id);
	const router = useRouter();
	const seller = `${router.query.seller as string}`.toLowerCase();

	const selectedListing = resaleListings.find(
		(listing) => seller === listing.seller.address.toLowerCase()
	);

	return (
		<Container className="flex flex-col gap-2 py-4">
			{isLoading && (
				<>
					<Container className="py-4 flex justify-center">
						<Text>
							<Spinner />
						</Text>
					</Container>
				</>
			)}
			{!isLoading && (
				<>
					{resaleListings.length > 0 && (
						<AnimatePresence>
							<Container className="flex flex-col gap-2">
								{selectedListing && (
									<ResaleListing
										seller={seller}
										{...selectedListing}
									/>
								)}
								{resaleListings.map((listing) => (
									<ResaleListing
										listing={listing}
										key={listing.seller}
										seller={seller}
									/>
								))}
							</Container>
						</AnimatePresence>
					)}

					{resaleListings.length === 0 && (
						<Container className="flex">
							<Text>No resale listings available for this NFT</Text>
						</Container>
					)}
				</>
			)}
		</Container>
	);
}

function ResaleListing({listing, seller}) {
	if (!listing) return null;
	return (
		<ResaleItemWithBuy nft={1}>
			{(buy) => (
				<Container
					key={listing.seller.address}
					onClick={() => {
						buy(listing);
					}}
					className="rounded-xl p-2 cursor-pointer shadow transition-all duration-75 flex justify-between items-center"
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
					<Container className="flex gap-4 items-center">
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
								<Text>{listing.quantity} available</Text>
								<Text>&bull;</Text>
								<Text>
									{Web3.utils.fromWei(listing.price.toString()).toString()} BNB
								</Text>
							</p>
						</Container>
					</Container>
					<Container>
						<Tag>Buy now</Tag>
					</Container>
				</Container>
			)}
		</ResaleItemWithBuy>
	);
}
