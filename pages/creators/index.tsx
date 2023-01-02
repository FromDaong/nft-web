/* eslint-disable no-mixed-spaces-and-tabs */
import SuggestedCreatorCard from "@packages/feed/components/SuggestedCreatorCard";
import NFTDropdownSort from "@packages/navigation/components/NFTDropdownFilter";
import {TritPost} from "@packages/post/TritPost";
import {ExpandableSearch} from "@packages/search/ExpandableSearch";
import {SEOHead} from "@packages/seo/page";
import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import {Input} from "@packages/shared/components/Input";
import SelectableTag from "@packages/shared/components/Selectabletag";
import {useDebounce} from "@packages/shared/hooks";
import DynamicSkeleton from "@packages/skeleton";
import {
	FeaturedCreatorSkeleton,
	TritPostSkeleton,
} from "@packages/skeleton/config";
import {apiEndpoint, legacy_nft_to_new} from "@utils/index";
import axios from "axios";
import ApplicationFrame from "core/components/layouts/ApplicationFrame";
import ApplicationLayout from "core/components/layouts/ApplicationLayout";
import TreatCore from "core/TreatCore";
import {useRouter} from "next/router";
import {TreatNFTsInfinityScrollingContainer} from "packages/shared/components/ListingSection";
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
	const [sort, setSortBy] = useState<string>(router.query.sort as string);
	const [searchText, setSearchText] = useState(
		(router.query.q ?? "") as string
	);
	const search = useDebounce(searchText, 400);

	const {
		data,
		isFetchingNextPage,
		fetchNextPage,
		hasNextPage,
		isFetching,
		refetch,
	} = TreatCore.useInfiniteQuery({
		queryKey: ["creatorsInfinite"],
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

	const sortMap = ["Lowest price first", "Highest price first", "Newest first"];

	return (
		<ApplicationLayout>
			<ApplicationFrame>
				<SEOHead title="Explore Creators" />
				<Container className="flex flex-col gap-12 py-12">
					<Container className="w-full flex-wrap px-4 flex items-center gap-4">
						<Container className="max-w-xl w-full ">
							<Input
								css={{width: "100%", padding: "8px 12px", borderRadius: "8px"}}
								placeholder={"Search"}
								onChange={(e) => setSearchText(e.target.value)}
								value={searchText}
							/>
						</Container>
					</Container>
					<Container className="flex flex-col gap-8 px-4 xl:px-0">
						<Container
							className={`${
								isFetching ? "opacity-80" : ""
							} grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8`}
						>
							{creators.length > 0
								? creators.map((creator) => (
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
								: new Array(20).fill(0).map((_, i) => (
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
								  ))}
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
