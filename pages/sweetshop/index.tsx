/* eslint-disable no-mixed-spaces-and-tabs */
import {FilterIcon, SearchIcon} from "@heroicons/react/outline";
import {useDisclosure} from "@packages/hooks";
import {Modal} from "@packages/modals";
import FilterNFTResultsModal from "@packages/modals/FilterNFTResultsModal";
import SweetshopSortBy from "@packages/post/SweetshopSortBy";
import {TritPost} from "@packages/post/TritPost";
import {ExpandableSearch} from "@packages/search/ExpandableSearch";
import {SEOHead} from "@packages/seo/page";
import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import {Divider} from "@packages/shared/components/Divider";
import {Input} from "@packages/shared/components/Input";
import SelectableTag from "@packages/shared/components/Selectabletag";
import {Heading, Text} from "@packages/shared/components/Typography/Headings";
import {
	ImportantText,
	MutedText,
} from "@packages/shared/components/Typography/Text";
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

const getSweetshopNFTs = async (page: number, filterString: string) => {
	const res = await axios.get(
		`${apiEndpoint}/marketplace/activity?page=${page ?? 1}${
			filterString ? "&market=" + filterString : ""
		}`
	);
	return res.data.data;
};

export default function NFTS(props) {
	const {ref, inView} = useInView();
	const [market_filter, setFilters] = useState(props.query.market);
	const [filterList, setFilterlist] = useState<
		Array<{
			label: string;
			value: string;
		}>
	>([]);
	const router = useRouter();

	const {
		data,
		isFetchingNextPage,
		fetchNextPage,
		hasNextPage,
		refetch,
		isFetching,
	} = TreatCore.useInfiniteQuery({
		queryKey: ["sweetshopNFTsInfinite"],
		queryFn: ({pageParam = 1}) => getSweetshopNFTs(pageParam, market_filter),
		getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
		getPreviousPageParam: (firstPage) => firstPage.prevPage ?? undefined,
	});

	const pages = data ? data.pages : [];

	const posts = useMemo(() => {
		if (pages.length > 0) {
			return pages
				.map((page) => page.docs)
				.flat()
				.map((post) =>
					legacy_nft_to_new({
						...post.nft,
						price: post.price,
						_id: post._id,
						creator: {
							...post.creator,
							profile: post.creator_profile,
						},
					})
				);
		} else {
			return [];
		}
	}, [pages]);

	const toggleFilter = (filter: string) => {
		// add filter if it doesnt exist, remove if it does
		if (filter === market_filter) {
			setFilters("");
		} else {
			setFilters(filter);
		}
	};

	useEffect(() => {
		if (market_filter) {
			router.push(`/sweetshop?market=${market_filter}`, undefined, {
				shallow: true,
			});
		} else {
			router.push(`/sweetshop`, undefined, {shallow: true});
		}
		refetch({refetchPage: (page, index) => index === 0});
	}, [market_filter]);

	useEffect(() => {
		if (inView) {
			fetchNextPage();
		}
	}, [inView]);

	// T-44 Implement search bar for sweetshop NFTs + filters with inspiration form Airbnb

	return (
		<ApplicationLayout>
			<ApplicationFrame>
				<SEOHead title="Explore NFTs" />
				<Container className="flex flex-col gap-12 py-12">
					<Container className="flex flex-col">
						<Container className="px-2 flex flex-col gap-8">
							<Container className="flex gap-4 justify-center px-2">
								<ExpandableSearch />
							</Container>
							{false && (
								<Container className="flex justify-between px-2">
									<Container className="flex gap-2 overflow-x-auto flex-nowrap">
										{filterList.map((f) => (
											<Container
												key={f.value}
												className="flex-shrink-0"
											>
												<SelectableTag
													toggle={toggleFilter}
													key={f.value}
													selected={market_filter}
													label={f.label}
													value={f.value}
												/>
											</Container>
										))}
									</Container>
								</Container>
							)}
						</Container>
					</Container>

					<Container className="flex flex-col gap-8 px-4 xl:px-0">
						<Container className={isFetching ? "opacity-80" : ""}>
							<TreatNFTsInfinityScrollingContainer>
								{posts.length > 0
									? posts.map((nft) => (
											<div
												key={nft.id}
												className="col-span-1"
											>
												<TritPost
													inGrid
													{...nft}
												/>
											</div>
									  ))
									: new Array(20).fill(20).map((_, i) => (
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
									  ))}
							</TreatNFTsInfinityScrollingContainer>
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
