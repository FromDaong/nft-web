/* eslint-disable no-mixed-spaces-and-tabs */
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

const InfinitySpinner = ({fetchNext, isFetching}) => {
	const ref = useRef(null);

	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					fetchNext();
				}
			},
			{
				root: null,
				rootMargin: "0px",
				threshold: 1.0,
			}
		);

		if (ref.current) {
			observer.observe(ref.current);
		}

		return () => {
			if (ref.current) {
				observer.unobserve(ref.current);
			}
		};
	}, [ref, fetchNext]);

	return (
		<Container
			ref={ref}
			className="flex justify-center py-4"
		>
			<Text>
				<Spinner />
			</Text>
		</Container>
	);
};

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
				<SweetshopTabs />
				<TagsFilter />
				{!error && (
					<MarketplaceListingResults
						scrollerRef={scrollerRef}
						nft_posts={data?.pages?.flat() ?? []}
						fetchNext={fetchNextPage}
						hasNextPage={hasNextPage}
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

const NFTListContainer = styled("div", {
	flexWrap: "wrap",
	display: "grid",
	gap: "2rem",
	gridTemplateColumns: "repeat(1, minmax(0, 1fr))",
	maxWidth: "100%",
	marginX: "auto",
	"@media (min-width: 768px)": {
		gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
	},
	"@media (min-width: 1024px)": {
		gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
	},
	"@media (min-width: 1280px)": {
		gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
		maxWidth: 1280,
	},
	"@media (min-width: 1536px)": {
		gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
	},
});

const ItemWrapper = styled("div", {
	flex: 1,
	textAlign: "center",
	padding: "1rem",
	whiteSpace: "nowrap",
});

const NFTItemContainer = styled("div", {
	gridColumn: "span 1 / span 1",
	display: "flex",
	flexDirection: "column",
	"@md": {
		width: 0.5,
	},
	"@sm": {
		width: "100%",
	},
});

function MarketplaceListingResults({
	nft_posts,
	fetchNext,
	hasNextPage,
	scrollerRef,
}) {
	const getNextPage = () => {
		if (hasNextPage) fetchNext();
	};
	return (
		<>
			<VirtuosoGrid
				className="w-full px-2 py-8"
				useWindowScroll
				totalCount={nft_posts.length}
				overscan={24}
				endReached={getNextPage}
				customScrollParent={scrollerRef.current}
				components={{
					// Header: Header,
					Item: NFTItemContainer,
					List: NFTListContainer,
					ScrollSeekPlaceholder: ({height, width, index}) => (
						<NFTItemContainer>
							<ItemWrapper>{"--"}</ItemWrapper>
						</NFTItemContainer>
					),
				}}
				itemContent={(index) => {
					const nft = nft_posts[index];
					return (
						<SweetshopNFT
							inGrid
							{...nft}
						/>
					);
				}}
			/>
		</>
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
