/* eslint-disable no-mixed-spaces-and-tabs */
import SweetshopTabs from "@components/MarketPlace/MarketFilter";
import TagsFilter from "@components/MarketPlace/TagsFilter";
import SweetshopNFT from "@components/NFTCard/cards/Sweetshop";
import {SEOHead} from "@packages/seo/page";
import {Container} from "@packages/shared/components/Container";
import {usePaginatedPage} from "@packages/shared/components/Pagination/lib";
import {Heading, Text} from "@packages/shared/components/Typography/Headings";
import Spinner from "@packages/shared/icons/Spinner";
import {apiEndpoint, legacy_nft_to_new} from "@utils/index";
import axios from "axios";
import TreatCore from "core/TreatCore";
import ApplicationFrame from "core/components/layouts/ApplicationFrame";
import ApplicationLayout from "core/components/layouts/ApplicationLayout";
import {useRouter} from "next/router";
import {MarketplaceListingsContainer} from "packages/shared/components/ListingSection";
import {useEffect, useRef} from "react";

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

	console.log({marketQuery, isLoading, data});

	return (
		<ApplicationLayout>
			<SweetshopTabs />
			<ApplicationFrame>
				<SEOHead title="Explore NFTs" />
				<TagsFilter />

				<Container className="relative flex w-full h-full gap-8">
					<Container
						css={{
							opacity: isLoading ? 0.5 : 1,
						}}
						className="flex-1 w-full"
					>
						{!error && (
							<MarketplaceListingResults
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
					</Container>
				</Container>
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

function MarketplaceListingResults({nft_posts, fetchNext, hasNextPage}) {
	return (
		<Container className="flex flex-col gap-8">
			<Container className="flex flex-col gap-8 overflow-x-hidden">
				<MarketplaceListingsContainer>
					{nft_posts.length > 0 ? (
						nft_posts.map((nft) => (
							<div
								key={nft._id}
								className="col-span-1"
							>
								<SweetshopNFT
									inGrid
									{...nft}
								/>
							</div>
						))
					) : (
						<Container className="flex flex-col items-center col-span-1 py-24 md:col-span-2 xl:col-span-5">
							<Heading size="sm">No results found</Heading>
						</Container>
					)}
				</MarketplaceListingsContainer>
			</Container>
			{hasNextPage && (
				<InfinitySpinner
					isFetching={false}
					fetchNext={fetchNext}
				/>
			)}
		</Container>
	);
}
