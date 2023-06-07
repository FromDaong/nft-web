import SweetshopNFT from "@components/NFTCard/cards/Sweetshop";
import {Container} from "@packages/shared/components/Container";
import Spinner from "@packages/shared/icons/Spinner";
import {treatMarketplaceReaderContract} from "@packages/treat/lib/contract-defs";
import {apiEndpoint, legacy_nft_to_new} from "@utils/index";
import axios from "axios";
import BigNumber from "bignumber.js";
import {useUser} from "core/auth/useUser";
import ProfileLayout from "core/components/layouts/ProfileLayout";
import {useSession} from "next-auth/react";
import {useEffect, useMemo, useState} from "react";
import {beforePageLoadGetUserProfile} from "server/page/userProfile";

type ResaleOrder = {
	creators: string[];
	nftIds: BigNumber[];
	prices: BigNumber[];
	amounts: BigNumber[];
};

export default function UserProfile(props: {
	error: boolean;
	notFound: boolean;
	data: any;
}) {
	const {profile} = useUser();
	const data = JSON.parse(props.data);
	const [isLoading, setIsLoading] = useState(true);
	const [stage, setStage] = useState<"readOrderBook" | "populateNFT" | "done">(
		"readOrderBook"
	);

	const [resaleOrders, setResaleOrders] = useState(null);
	const [nftsForOrders, setNftsForOrders] = useState(null);
	const {username} = data;

	const resaleMarketListings = useMemo(() => {
		if (nftsForOrders?.length === 0 || !nftsForOrders) return [];
		return nftsForOrders
			.filter((nft) => nft)
			.map((nft, i) =>
				legacy_nft_to_new({
					...nft,
					price: resaleOrders.prices[i],
					count: resaleOrders.amounts[i],
					seller: {
						address: profile?.address ?? null,
						username: profile?.username,
						display_name: profile?.display_name,
					},
				})
			);
	}, [resaleOrders, nftsForOrders]);

	useEffect(() => {
		treatMarketplaceReaderContract.functions
			.readAllOrdersForSeller(data.address)
			.then((orders: ResaleOrder) =>
				setResaleOrders({
					creators: orders[0],
					nftIds: orders[1],
					prices: orders[2],
					amounts: orders[3],
				})
			)
			.finally(() => setStage("populateNFT"));
	}, [profile]);

	useEffect(() => {
		if (resaleOrders) {
			Promise.all(
				resaleOrders.nftIds.map(async (nftId) => {
					const res = await axios.get(
						`${apiEndpoint}/nft/${new BigNumber(nftId.toString()).toNumber()}`
					);
					return res.data.data;
				})
			)
				.then((data) => setNftsForOrders(data))
				.finally(() => {
					setIsLoading(false);
					setStage("done");
				});
		}
	}, [resaleOrders]);

	return (
		<ProfileLayout userProfile={data}>
			<Container className="flex flex-col items-center">
				{isLoading && <Spinner />}
				{resaleMarketListings.length > 0 && (
					<Container className="grid w-full grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
						{resaleMarketListings.map((listing) => (
							<SweetshopNFT
								key={listing.id}
								{...listing}
								count={BigNumber(listing.count.toString()).toNumber()}
								price={{
									value: new BigNumber(
										listing.price.value.toString()
									).toNumber(),
									currency: "BNB",
								}}
							/>
						))}
					</Container>
				)}
			</Container>
		</ProfileLayout>
	);
}

export const getServerSideProps = beforePageLoadGetUserProfile;
