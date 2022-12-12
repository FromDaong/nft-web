/* eslint-disable no-mixed-spaces-and-tabs */
import SweetshopSortBy from "@packages/post/SweetshopSortBy";
import {SkeletonTritCollectiblePost, TritPost} from "@packages/post/TritPost";
import {SEOHead} from "@packages/seo/page";
import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import {Divider} from "@packages/shared/components/Divider";
import SelectableTag from "@packages/shared/components/Selectabletag";
import {Heading} from "@packages/shared/components/Typography/Headings";
import {apiEndpoint, legacy_nft_to_new} from "@utils/index";
import axios from "axios";
import ApplicationFrame from "core/components/layouts/ApplicationFrame";
import ApplicationLayout from "core/components/layouts/ApplicationLayout";
import TreatCore from "core/TreatCore";
import {useRouter} from "next/router";
import {InfinityScrollListing} from "packages/shared/components/ListingSection";
import {useEffect, useMemo, useState} from "react";
import {useInView} from "react-intersection-observer";

const getSweetshopNFTs = async (page: number, filterString: string) => {
	const res = await axios.get(
		`${apiEndpoint}/marketplace?page=${page ?? 1}${
			filterString ? "&market=" + filterString : ""
		}`
	);
	return res.data.data;
};

const filtersList = [
	{
		label: "Free",
		value: "free",
	},
	{
		label: "Sold out",
		value: "sold_out",
	},
	{
		label: "TOTM NFT",
		value: "totm_nft",
	},
	{
		label: "Subscription NFT",
		value: "subscription_nft",
	},
];

export default function NFTS(props) {
	const {ref, inView} = useInView();
	const [market_filter, setFilters] = useState(props.query.market);
	const router = useRouter();

	const {data, isFetchingNextPage, fetchNextPage, hasNextPage, refetch} =
		TreatCore.useInfiniteQuery({
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
				.map((post) => legacy_nft_to_new(post));
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

	return (
		<ApplicationLayout>
			<ApplicationFrame>
				<SEOHead title="Explore NFTs" />
				<Container className="flex flex-col gap-12 py-12">
					<Container className="flex flex-col px-4 xl:px-0">
						<Heading size="md">Browse sweetshop trits</Heading>
						<Divider dir="horizontal" />
						<Container>
							<Container className="flex flex-col gap-4 md:flex-row md:justify-between">
								<Container className="flex gap-2">
									{filtersList.map((f) => (
										<SelectableTag
											toggle={toggleFilter}
											key={f.value}
											selected={market_filter}
											label={f.label}
											value={f.value}
										/>
									))}
								</Container>
								<Container className="flex gap-4">
									<SweetshopSortBy />
								</Container>
							</Container>
							<Divider dir="horizontal" />
						</Container>
					</Container>

					<Container className="px-4 xl:px-0 flex flex-col gap-8">
						<InfinityScrollListing>
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
											<SkeletonTritCollectiblePost />
										</Container>
								  ))}
						</InfinityScrollListing>
						<Container className="flex w-full justify-center">
							<Button
								appearance={"surface"}
								ref={ref}
								onClick={() => fetchNextPage()}
								disabled={!hasNextPage || isFetchingNextPage}
							>
								{isFetchingNextPage
									? "Loading more..."
									: hasNextPage
									? "Load Newer"
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
