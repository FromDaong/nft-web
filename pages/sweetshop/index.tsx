/* eslint-disable no-mixed-spaces-and-tabs */
import NFTDropdownSort from "@packages/Dropdowns/NFTDropdownSort";
import {TritPost} from "@packages/post/TritPost";
import {ExpandableSearch} from "@packages/search/ExpandableSearch";
import {SEOHead} from "@packages/seo/page";
import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import {Input} from "@packages/shared/components/Input";
import Pagination from "@packages/shared/components/Pagination";
import SelectableTag from "@packages/shared/components/Selectabletag";
import {Heading} from "@packages/shared/components/Typography/Headings";
import {useDebounce} from "@packages/shared/hooks";
import DynamicSkeleton from "@packages/skeleton";
import {TritPostSkeleton} from "@packages/skeleton/config";
import {apiEndpoint, legacy_nft_to_new} from "@utils/index";
import axios from "axios";
import ApplicationFrame from "core/components/layouts/ApplicationFrame";
import ApplicationLayout from "core/components/layouts/ApplicationLayout";
import TreatCore from "core/TreatCore";
import {useRouter} from "next/router";
import {TreatNFTsInfinityScrollingContainer} from "packages/shared/components/ListingSection";
import {useEffect, useMemo, useState} from "react";
import {useInView} from "react-intersection-observer";

const getSweetshopNFTs = async (page: number, sort: string, search: string) => {
	const res = await axios.get(
		`${apiEndpoint}/marketplace/activity?page=${page ?? 1}${
			sort ? "&sort=" + sort : ""
		}${search ? "&q=" + search : ""}`
	);
	return res.data.data;
};

export default function NFTS() {
	const {ref, inView} = useInView();
	const router = useRouter();
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [sort, setSortBy] = useState<string>(router.query.sort as string);
	const [searchText, setSearchText] = useState(
		(router.query.q ?? "") as string
	);
	const search = useDebounce(searchText, 400);

	const {
		data,
		fetchNextPage,
		hasNextPage,
		isFetching,
		refetch,
		isLoading,
		fetchPreviousPage,
	} = TreatCore.useInfiniteQuery({
		queryKey: [`sweetshopNFTsInfinite:${search}`],
		queryFn: ({pageParam = 1}) => {
			setPage(pageParam);
			return getSweetshopNFTs(pageParam, sort, search);
		},
		getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
		getPreviousPageParam: (firstPage) => firstPage.prevPage ?? undefined,
	});

	const pages = data ? data.pages : [];

	const posts = useMemo(() => {
		if (pages.length > 0) {
			setTotalPages(pages[0].totalPages);
			return pages[page - 1].docs.map((post) =>
				legacy_nft_to_new({
					...post.nft,
					price: post.price,
					_id: post.nft._id,
					creator: {
						...post.creator,
						profile: post.creator_profile,
					},
					seller: {
						address: post.seller.address,
						profile_pic: post.seller.profile_pic,
						username: post.seller.username,
						display_name: post.seller.display_name,
						event_id: post._id,
					},
				})
			);
		} else {
			return [];
		}
	}, [pages]);

	const nextPage = () => {
		setPage(page + +1);
		changePage();
		fetchNextPage();
	};

	const prevPage = () => {
		setPage(page + -1);
		changePage();
		fetchPreviousPage();
	};

	const changePage = () => {
		window.scrollTo(0, 0);
	};

	useEffect(() => {
		if (inView) {
			fetchNextPage();
		}
	}, [inView]);

	// T-44 Implement search bar for sweetshop NFTs + filters with inspiration form Airbnb
	useEffect(() => {
		refetch();

		router.push(
			{
				query: {
					...(sort ? {sort} : {sort: "3"}),
					...(search ? {q: search} : {}),
					...(page ? {p: page} : {p: 1}),
				},
			},
			undefined,
			{
				shallow: true,
			}
		);

		if (!sort) {
			setSortBy("3");
		}
	}, [search, sort]);

	useEffect(() => {
		router.push(
			{
				query: {
					...(sort ? {sort} : {sort: "3"}),
					...(search ? {q: search} : {}),
					...(page ? {p: page} : {p: 1}),
				},
			},
			undefined,
			{
				shallow: true,
			}
		);
	}, [page]);

	const sortMap = ["Lowest price first", "Highest price first", "Newest first"];

	return (
		<ApplicationLayout>
			<ApplicationFrame>
				<SEOHead title="Explore NFTs" />
				<Container className="flex flex-col gap-12 py-12">
					<Container className="flex flex-wrap items-center w-full gap-4 px-4">
						<Container className="w-full max-w-xl ">
							<Input
								css={{width: "100%", padding: "8px 12px", borderRadius: "8px"}}
								placeholder={"Start typing to search for NFTs"}
								onChange={(e) => setSearchText(e.target.value)}
								value={searchText}
							/>
						</Container>
						<Container className="flex flex-1 gap-4">
							<NFTDropdownSort
								sort={sort}
								setSort={setSortBy}
								label={sortMap[Number(sort ?? 3) - 1]}
							/>
						</Container>
					</Container>
					<Container className="flex flex-col gap-8 px-4 xl:px-0">
						<Container className={isFetching ? "opacity-40" : ""}>
							<TreatNFTsInfinityScrollingContainer>
								{posts.length > 0 ? (
									posts.map((nft) => (
										<div
											key={nft._id}
											className="col-span-1"
										>
											<TritPost
												inGrid
												{...nft}
											/>
										</div>
									))
								) : isLoading ? (
									new Array(20).fill(20).map((_, i) => (
										<Container
											key={i}
											className="col-span-1 border"
											css={{
												borderColor: "$subtleBorder",
												padding: "16px",
												borderRadius: "16px",
											}}
										>
											<DynamicSkeleton config={TritPostSkeleton} />
										</Container>
									))
								) : (
									<Container className="flex flex-col items-center col-span-1 py-24 md:col-span-2 xl:col-span-5">
										<Heading size="sm">No results found</Heading>
									</Container>
								)}
							</TreatNFTsInfinityScrollingContainer>
						</Container>
						{!isFetching && (
							<Pagination
								hasNextPage={hasNextPage}
								hasPrevPage={page - 1 > 0}
								gotoPage={(page) =>
									router.push({query: {...router.query, p: page}})
								}
								page={page}
								totalPages={+totalPages}
								next={nextPage}
								prev={prevPage}
								nextPage={page + +1}
								prevPage={page - +1}
							/>
						)}
					</Container>
				</Container>
			</ApplicationFrame>
		</ApplicationLayout>
	);
}

export const getServerSideProps = async (ctx) => {
	return {
		props: {
			query: ctx.query,
		},
	};
};
