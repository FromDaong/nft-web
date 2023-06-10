/* eslint-disable no-mixed-spaces-and-tabs */
import MarketplaceListingResults from "@components/MarketPlace/Listings/VirtualGridList";
import SweetshopTabs from "@components/MarketPlace/MarketFilter";
import TagsFilter from "@components/MarketPlace/TagsFilter";
import SweetshopNFT from "@components/NFTCard/cards/Sweetshop";
import {SEOHead} from "@packages/seo/page";
import {Container} from "@packages/shared/components/Container";
import {Heading, Text} from "@packages/shared/components/Typography/Headings";
import Spinner from "@packages/shared/icons/Spinner";
import {styled} from "@styles/theme";
import {apiEndpoint, legacy_nft_to_new} from "@utils/index";
import axios from "axios";
import TreatCore from "core/TreatCore";
import ApplicationFrame from "core/components/layouts/ApplicationFrame";
import ApplicationLayout from "core/components/layouts/ApplicationLayout";
import {useRouter} from "next/router";
import {MarketplaceListingsContainer} from "packages/shared/components/ListingSection";
import {memo, useEffect, useMemo, useRef} from "react";
import {VirtuosoGrid} from "react-virtuoso";

export default function NFTS({nfts, error}) {
	const scrollerRef = useRef(null);
	const posts = JSON.parse(nfts);
	const router = useRouter();
	const {sort: sortQuery, tags: tagQuery, tab: marketQuery} = router.query;

	// useInfinityQuery
	const {
		data,
		isLoading,
		isError,
		isFetching,
		fetchNextPage,
		hasNextPage,
		refetch,
	} = TreatCore.useInfiniteQuery(
		["marketplace", "activity"],
		async ({pageParam = 1}) => {
			const res = await axios.get(
				`${apiEndpoint}/marketplace/listings?page=${pageParam}${
					"&sort=" + sortQuery
				}${tagQuery ? "&tags=" + tagQuery : ""}${
					marketQuery ? "&market=" + marketQuery : ""
				}`
			);
			const {data} = res.data;

			data.docs = data.docs.map((post) =>
				legacy_nft_to_new({
					...post,
					price: post.price,
					_id: post._id,
					creator: {
						...post.creator,
						profile: post.creator.profile,
					},
					seller: post.seller.address
						? post.seller
						: {
								address: post.creator.address,
								profile_pic: post.creator.profile?.profile_pic,
								username: post.creator.username,
								display_name: post.creator.display_name,
								event_id: post._id,
						  },
				})
			);
			return data;
		},
		{
			getNextPageParam: (lastPage) =>
				lastPage.hasNextPage ? lastPage.nextPage : null,
			select: (data) => {
				return {
					pages: data.pages.map((page) => page.docs),
					pageParams: data.pages.map((page) => page.page),
				};
			},
			placeholderData: {
				pages: [posts],
				pageParams: [1],
			},
		}
	);

	useEffect(() => {
		refetch();
	}, [sortQuery, tagQuery, marketQuery]);

	return (
		<ApplicationLayout thisRef={scrollerRef}>
			<SEOHead title="Explore NFTs" />
			<ApplicationFrame>
				<Container className="py-4 md:py-8">
					<SweetshopTabs />
				</Container>
				{!error && (
					<MarketplaceListingResults
						scrollerRef={scrollerRef}
						data={data?.pages?.flat() ?? []}
						fetchNext={fetchNextPage}
						hasNextPage={hasNextPage}
						Component={SweetshopNFT}
					/>
				)}
				{error && (
					<Container className="flex flex-col gap-12 py-12">
						<Heading>An error occurred</Heading>
					</Container>
				)}
			</ApplicationFrame>
		</ApplicationLayout>
	);
}

export const getServerSideProps = async (ctx) => {
	const {q, p} = ctx.query;
	const sort = ctx.query.sort ?? "3";

	try {
		const res = await axios.get(
			`${apiEndpoint}/marketplace/activity?page=${p ?? 1}${"&sort=" + sort}${
				q ? "&q=" + q : ""
			}`
		);

		const {data} = res.data;

		data.docs = data.docs.map((post) =>
			legacy_nft_to_new({
				...post,
				price: post.price,
				_id: post._id,
				creator: {
					...post.creator,
					profile: post.creator.profile,
				},
				seller: {
					address: post.creator.address,
					profile_pic: post.creator.profile.profile_pic,
					username: post.creator.username,
					display_name: post.creator.display_name,
					event_id: post._id,
				},
			})
		);
		return {
			props: {
				sort: sort ?? 3,
				q: q ?? "",
				p: p ?? 1,
				nfts: JSON.stringify(data),
			},
		};
	} catch (err) {
		return {
			props: {
				sort: sort ?? 3,
				q: q ?? "",
				p: p ?? 1,
				nfts: JSON.stringify({docs: [], hasNextPage: false, totalPages: 1}),
				error: true,
			},
		};
	}
};
