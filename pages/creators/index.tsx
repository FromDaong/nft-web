/* eslint-disable no-mixed-spaces-and-tabs */
import CreatorsDropdownSort from "@packages/Dropdowns/CreatorsDropdownSort";
import SuggestedCreatorCard from "@packages/feed/components/SuggestedCreatorCard";
import {SEOHead} from "@packages/seo/page";
import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import {Input} from "@packages/shared/components/Input";
import {Heading} from "@packages/shared/components/Typography/Headings";
import {useDebounce} from "@packages/shared/hooks";
import DynamicSkeleton from "@packages/skeleton";
import {FeaturedCreatorSkeleton} from "@packages/skeleton/config";
import {apiEndpoint} from "@utils/index";
import axios from "axios";
import ApplicationFrame from "core/components/layouts/ApplicationFrame";
import ApplicationLayout from "core/components/layouts/ApplicationLayout";
import TreatCore from "core/TreatCore";
import {useRouter} from "next/router";
import {useEffect, useMemo, useState} from "react";
import {useInView} from "react-intersection-observer";

const getSweetshopNFTs = async (page: number, search: string) => {
	const res = await axios.get(
		`${apiEndpoint}/creator/all?page=${page ?? 1}${
			search ? "&q=" + search : ""
		}`
	);
	return res.data.data;
};

export default function NFTS() {
	const {ref, inView} = useInView();
	const router = useRouter();
	const [searchText, setSearchText] = useState(
		(router.query.q ?? "") as string
	);
	const search = useDebounce(searchText, 400);
	const [sort, setSortBy] = useState<string>(router.query.sort as string);
	const [page, setPage] = useState(1);

	const {
		data,
		isFetchingNextPage,
		fetchNextPage,
		hasNextPage,
		isFetching,
		refetch,
		isLoading,
		fetchPreviousPage,
	} = TreatCore.useInfiniteQuery({
		queryKey: [`creatorsInfinite:${search}`],
		queryFn: ({pageParam = 1}) => getSweetshopNFTs(pageParam, search),
		getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
		getPreviousPageParam: (firstPage) => firstPage.prevPage ?? undefined,
	});

	const pages = data ? data.pages : [];

	const creators = useMemo(() => {
		if (pages.length > 0) {
			return pages.map((page) => page.docs).flat();
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
			setSortBy("1");
		}
	}, [search, sort, page]);

	const sort_labels_map = [
		"A-Z",
		"Z-A",
		"Most followers",
		"Least followers",
		"Most NFTs",
		"Least NFTs",
	];

	return (
		<ApplicationLayout>
			<ApplicationFrame>
				<SEOHead title="Explore Creators" />
				<Container className="flex flex-col gap-12 py-12">
					<Container className="flex flex-wrap items-center w-full gap-4 px-4">
						<Container className="w-full max-w-xl ">
							<Input
								css={{
									width: "100%",
									padding: "8px 12px",
									borderRadius: "8px",
									backgroundColor: "$elementOnSurface",
								}}
								placeholder={"Start typing to search for creators"}
								onChange={(e) => setSearchText(e.target.value)}
								value={searchText}
							/>
						</Container>
						<CreatorsDropdownSort
							sort={sort}
							setSort={setSortBy}
							label={sort_labels_map[parseInt(sort) - 1]}
						/>
					</Container>
					<Container className="flex flex-col gap-8 px-4 xl:px-0">
						<Container
							className={`${
								isFetching ? "opacity-40" : ""
							} grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8`}
						>
							{creators.length > 0 ? (
								creators.map((creator) => (
									<SuggestedCreatorCard
										key={creator._id}
										username={creator.username}
										display_name={creator.profile?.display_name}
										avatar={creator.profile?.profile_pic}
										bio={creator.profile?.bio}
										isExpanded
										border
										live={creator.livestream_active}
										followers={creator.profile?.followers?.length}
										subscribers={creator.profile?.following?.length}
									/>
								))
							) : isLoading ? (
								new Array(20).fill(0).map((_, i) => (
									<Container
										key={i}
										className="col-span-1 border"
										css={{
											borderColor: "$subtleBorder",
											padding: "16px",
											borderRadius: "16px",
										}}
									>
										<DynamicSkeleton config={FeaturedCreatorSkeleton} />
									</Container>
								))
							) : (
								<Container className="flex flex-col items-center col-span-1 py-24 md:col-span-2 lg:col-span-3 xl:col-span-4">
									<Heading size="sm">No results found</Heading>
								</Container>
							)}
						</Container>
						<Container className="flex justify-center w-full">
							<Button
								appearance={"surface"}
								ref={ref}
								onClick={() => fetchNextPage()}
								disabled={!hasNextPage || isFetchingNextPage}
							>
								{isFetchingNextPage
									? "Loading more..."
									: hasNextPage
									? "Load more"
									: "Nothing more to load"}
							</Button>
						</Container>
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
