/* eslint-disable no-mixed-spaces-and-tabs */
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
	const [sort, setSortBy] = useState<string>("");
	const router = useRouter();
	const [searchText, setSearchText] = useState(
		(router.query.search ?? "") as string
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
		queryKey: ["sweetshopNFTsInfinite"],
		queryFn: ({pageParam = 1}) => getSweetshopNFTs(pageParam, sort, search),
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

	useEffect(() => {
		if (inView) {
			fetchNextPage();
		}
	}, [inView]);

	// T-44 Implement search bar for sweetshop NFTs + filters with inspiration form Airbnb
	useEffect(() => {
		refetch();
	}, [search, sort]);

	return (
		<ApplicationLayout>
			<ApplicationFrame>
				<SEOHead title="Explore NFTs" />
				<Container className="flex flex-col gap-12 py-12">
					<Container className="w-full px-4 flex items-center gap-4">
						<Container className="max-w-xl w-full ">
							<Input
								css={{borderRadius: "9999px", width: "100%"}}
								placeholder={"Search"}
								onChange={(e) => setSearchText(e.target.value)}
								value={searchText}
							/>
						</Container>
						<NFTDropdownSort setSort={setSortBy} />
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
