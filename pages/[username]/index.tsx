/* eslint-disable no-mixed-spaces-and-tabs */
import NFTListLoadingSkeleton from "@components/MarketPlace/Listings/LoadingSkeleton";
import MarketplaceListingResults from "@components/MarketPlace/Listings/VirtualGridList";
import ProfileNFTList from "@components/MarketPlace/Listings/VirtuosoProfileGrid";
import SweetshopNFT from "@components/NFTCard/cards/Sweetshop";
import ErrorOccurred from "@components/ui/error";
import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import {Heading, Text} from "@packages/shared/components/Typography/Headings";
import {apiEndpoint, legacy_nft_to_new} from "@utils/index";
import axios from "axios";
import {useUser} from "core/auth/useUser";
import ProfileLayout from "core/components/layouts/ProfileLayout";
import TreatCore from "core/TreatCore";
import {ArrowRight} from "lucide-react";
import Link from "next/link";
import {useMemo, useRef} from "react";
import {beforePageLoadGetUserProfile} from "server/page/userProfile";

export default function MyUserProfile(props: {
	error: boolean;
	notFound: boolean;
	data: any;
}) {
	const scrollerRef = useRef(null);

	const {profile} = useUser();
	const user_profile_data = JSON.parse(props.data ?? {});

	const {
		isLoading,
		data: listings,
		isError,
		fetchNextPage,
		hasNextPage,
		error,
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
						profile: post.creator.profile ?? {
							profile_pic: post.creator.profile.profile_pic,
						},
						avatar: post.creator.profile.profile_pic,
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
			{!isLoading && !isError && resaleNFTs?.length === 0 && (
				<Container className="flex justify-center py-32">
					<Container className="flex flex-col gap-8 text-center items-center">
						<Container className="flex flex-col gap-2">
							<Heading size={"sm"}>Nothing to see here</Heading>
							<Text>
								@{user_profile_data.username} has not listed any NFTs yet.
							</Text>
						</Container>
						<Link href={"/sweetshop"}>
							<a>
								<Button appearance={"action"}>
									Visit the sweetshop
									<ArrowRight className="w-4 h-4" />
								</Button>
							</a>
						</Link>
					</Container>
				</Container>
			)}
			{isLoading && <NFTListLoadingSkeleton />}
			{!isLoading && !isError && (
				<ProfileNFTList
					scrollerRef={scrollerRef}
					data={resaleNFTs ?? []}
					fetchNext={fetchNextPage}
					hasNextPage={hasNextPage}
					Component={SweetshopNFT}
					isFetching={isLoading}
				/>
			)}
			{isError && (
				<ErrorOccurred
					err={error}
					description={
						"We experienced an error while loading NFTs. Please reload the page."
					}
				/>
			)}
		</ProfileLayout>
	);
}

export const getServerSideProps = beforePageLoadGetUserProfile;
