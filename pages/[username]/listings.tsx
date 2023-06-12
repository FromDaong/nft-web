/* eslint-disable no-mixed-spaces-and-tabs */
import NFTListLoadingSkeleton from "@components/MarketPlace/Listings/LoadingSkeleton";
import MarketplaceListingResults from "@components/MarketPlace/Listings/VirtualGridList";
import SweetshopNFT from "@components/NFTCard/cards/Sweetshop";
import Spinner from "@packages/shared/icons/Spinner";
import {apiEndpoint, legacy_nft_to_new} from "@utils/index";
import axios from "axios";
import {useUser} from "core/auth/useUser";
import ProfileLayout from "core/components/layouts/ProfileLayout";
import TreatCore from "core/TreatCore";
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
		data: listings,
		isError,
		fetchNextPage,
		hasNextPage,
	} = TreatCore.useInfiniteQuery(
		["market-listings", user_profile_data.address],
		async ({pageParam = 1}) => {
			const {data} = await axios.get(
				`${apiEndpoint}/profile/${user_profile_data.username}/listed?page=${pageParam}`
			);
			const {data: nftData} = data;

			nftData.docs = nftData.docs.map((post) =>
				legacy_nft_to_new({
					...post,
					seller: {
						address: post.creator.address,
						profile_pic: post.creator.profile.profile_pic,
						username: post.creator.username,
						display_name: post.creator.display_name,
					},
					creator: {
						...post.creator,
						profile: post.creator.profile,
					},
				})
			);

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
		const docs = listings.pages.flat();
		return docs;
	}, [listings]);

	return (
		<ProfileLayout
			scrollerRef={scrollerRef}
			userProfile={user_profile_data}
		>
			{isLoading && <NFTListLoadingSkeleton />}
			{!isLoading && !isError && (
				<MarketplaceListingResults
					scrollerRef={scrollerRef}
					data={resaleNFTs ?? []}
					fetchNext={fetchNextPage}
					hasNextPage={hasNextPage}
					Component={SweetshopNFT}
					isFetching={isLoading}
				/>
			)}
		</ProfileLayout>
	);
}

export const getServerSideProps = beforePageLoadGetUserProfile;
