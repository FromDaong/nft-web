import SweetshopNFT from "@components/NFTCard/cards/Sweetshop";
import {Container} from "@packages/shared/components/Container";
import Spinner from "@packages/shared/icons/Spinner";
import {treatMarketplaceReaderContract} from "@packages/treat/lib/contract-defs";
import {apiEndpoint, legacy_nft_to_new} from "@utils/index";
import axios from "axios";
import BigNumber from "bignumber.js";
import TreatCore from "core/TreatCore";
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
	const nft_data = JSON.parse(props.data);

	const {
		isLoading,
		data: resaleMarketListings,
		isError,
		hasNextPage,
		fetchNextPage,
	} = TreatCore.useInfiniteQuery(
		["resale-market-listings", profile?.address],
		async ({pageParam = 0}) => {
			const {data} = await axios.get(
				`${apiEndpoint}/marketplace/listings/resale/seller/${nft_data.address}?page=${pageParam}}`
			);
			const {data: nftData} = data;

			nftData.docs = nftData.docs.map((post) => legacy_nft_to_new({...post}));

			return nftData;
		},
		{
			enabled: !!profile?.address,
			getNextPageParam: (lastPage) =>
				lastPage.hasNextPage ? lastPage.nextPage : null,
			select: (data) => {
				return {
					pages: data.pages.map((page) => page.docs),
					pageParams: data.pages.map((page) => page.page),
				};
			},
			placeholderData: {
				pages: [],
				pageParams: [1],
			},
		}
	);

	const resaleNFTs = useMemo(() => {
		const docs = resaleMarketListings.pages.flat();
		return docs;
	}, [resaleMarketListings]);

	return (
		<ProfileLayout userProfile={nft_data}>
			<Container className="flex flex-col items-center">
				<InfinityLoadingNFTs
					data={resaleNFTs}
					isFetching={isLoading}
					hasNext={hasNextPage}
					fetchNext={fetchNextPage}
				/>
			</Container>
		</ProfileLayout>
	);
}

const InfinityLoadingNFTs = ({data, fetchNext, hasNext, isFetching}) => {
	return (
		<>
			{isFetching && <Spinner />}
			{!isFetching && (
				<Container className="grid w-full grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
					{data.map((nft) => (
						<SweetshopNFT
							key={nft.id}
							{...nft}
						/>
					))}
				</Container>
			)}
		</>
	);
};

export const getServerSideProps = beforePageLoadGetUserProfile;
