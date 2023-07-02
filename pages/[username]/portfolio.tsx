/* eslint-disable no-mixed-spaces-and-tabs */
import NFTListLoadingSkeleton from "@components/MarketPlace/Listings/LoadingSkeleton";
import MarketplaceListingResults from "@components/MarketPlace/Listings/VirtualGridList";
import ProfileNFTList from "@components/MarketPlace/Listings/VirtuosoProfileGrid";
import PortfolioPublicListingCard from "@components/NFTCard/cards/PortfolioListingCard";
import ErrorOccurred from "@components/ui/error";
import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import {Heading, Text} from "@packages/shared/components/Typography/Headings";
import Spinner from "@packages/shared/icons/Spinner";
import {apiEndpoint, legacy_nft_to_new} from "@utils/index";
import axios from "axios";
import {useUser} from "core/auth/useUser";
import ProfileLayout from "core/components/layouts/ProfileLayout";
import TreatCore from "core/TreatCore";
import {ArrowRight, PlusIcon} from "lucide-react";
import Link from "next/link";
import {useMemo, useRef} from "react";
import {beforePageLoadGetUserProfile} from "server/page/userProfile";

export default function UserProfile(props: {
	error: boolean;
	notFound: boolean;
	data: any;
	nfts: any;
	sort: any;
	q: any;
	p: number;
}) {
	const scrollerRef = useRef(null);

	const {profile} = useUser();
	const user_profile_data = JSON.parse(props.data);

	const {
		isLoading,
		data: portfolioCollectedNFTs,
		isError,
		fetchNextPage,
		hasNextPage,
		error,
	} = TreatCore.useInfiniteQuery(
		["owned-by", user_profile_data.address],
		async ({pageParam = 1}) => {
			const {data} = await axios.get(
				`${apiEndpoint}/profile/${user_profile_data.username}/collected?p=${pageParam}&address=${user_profile_data.address}`
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

	const portfolioNFTs = useMemo(() => {
		const docs = portfolioCollectedNFTs?.pages.flat();
		return docs;
	}, [portfolioCollectedNFTs]);

	return (
		<>
			<ProfileLayout
				scrollerRef={scrollerRef}
				userProfile={user_profile_data}
			>
				{!isLoading && !isError && portfolioNFTs?.length === 0 && !!profile && (
					<Container className="flex justify-center py-32">
						<Container className="flex flex-col gap-8 text-center items-center">
							<Container className="flex flex-col gap-2">
								<Heading size={"sm"}>Nothing to see here</Heading>
								<Text>
									{user_profile_data.username} has not collected any NFTs yet.
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
						data={portfolioNFTs ?? []}
						fetchNext={fetchNextPage}
						hasNextPage={hasNextPage}
						Component={PortfolioPublicListingCard}
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
		</>
	);
}

/**
 * {
				...post,
				price: post.price,
				_id: post._id,
				creator: {
					...post.creator,
					profile: post.creator?.profile,
				},
				seller: {
					address: post.creator?.address,
					profile_pic: post.creator.profile?.profile_pic,
					username: post.creator?.username,
					display_name: post.creator.profile?.display_name,
					event_id: post._id,
				},
				count: nfts_data.base[i].amount,
				image: post.image ?? {},
			}
 */

export const getServerSideProps = beforePageLoadGetUserProfile;
