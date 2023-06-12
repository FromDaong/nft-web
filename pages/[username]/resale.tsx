import MarketplaceListingResults from "@components/MarketPlace/Listings/VirtualGridList";
import ResaleSweetshopCard from "@components/NFTCard/cards/ResaleSweetshopCard";
import Spinner from "@packages/shared/icons/Spinner";
import {apiEndpoint, legacy_nft_to_new} from "@utils/index";
import axios from "axios";
import TreatCore from "core/TreatCore";
import {useUser} from "core/auth/useUser";
import ProfileLayout from "core/components/layouts/ProfileLayout";
import {useMemo, useRef} from "react";
import {beforePageLoadGetUserProfile} from "server/page/userProfile";

export default function UserProfile(props: {
	error: boolean;
	notFound: boolean;
	data: any;
}) {
	const scrollerRef = useRef(null);

	const {profile} = useUser();
	const user_profile_data = JSON.parse(props.data);

	const {
		isLoading,
		data: resaleMarketListings,
		isError,
		fetchNextPage,
		hasNextPage,
	} = TreatCore.useInfiniteQuery(
		["resale-market-listings", user_profile_data.address],
		async ({pageParam = 0}) => {
			const {data} = await axios.get(
				`${apiEndpoint}/marketplace/listings/resale/seller/${user_profile_data.address}?page=${pageParam}`
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
		<ProfileLayout
			scrollerRef={scrollerRef}
			userProfile={user_profile_data}
		>
			{isLoading && <Spinner />}
			{!isLoading && !isError && (
				<MarketplaceListingResults
					scrollerRef={scrollerRef}
					data={resaleNFTs ?? []}
					fetchNext={fetchNextPage}
					hasNextPage={hasNextPage}
					Component={ResaleSweetshopCard}
					isFetching={isLoading}
				/>
			)}
		</ProfileLayout>
	);
}

export const getServerSideProps = beforePageLoadGetUserProfile;
