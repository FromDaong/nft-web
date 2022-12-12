/* eslint-disable no-mixed-spaces-and-tabs */
import SweetshopSortBy from "@packages/post/SweetshopSortBy";
import {SkeletonTritCollectiblePost, TritPost} from "@packages/post/TritPost";
import {SEOHead} from "@packages/seo/page";
import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import {Divider} from "@packages/shared/components/Divider";
import SelectableTag from "@packages/shared/components/Selectabletag";
import {Heading} from "@packages/shared/components/Typography/Headings";
import {
	ImportantText,
	MutedText,
	Text,
} from "@packages/shared/components/Typography/Text";
import {apiEndpoint, legacy_nft_to_new} from "@utils/index";
import axios from "axios";
import ApplicationFrame from "core/components/layouts/ApplicationFrame";
import ApplicationLayout from "core/components/layouts/ApplicationLayout";
import TreatCore from "core/TreatCore";
import {InfinityScrollListing} from "packages/shared/components/ListingSection";
import {useEffect, useMemo} from "react";
import {useInView} from "react-intersection-observer";

const getSweetshopNFTs = async (page: number) => {
	const res = await axios.get(`${apiEndpoint}/marketplace?page=${page ?? 1}`);
	return res.data.data;
};

export default function NFTS() {
	const {ref, inView} = useInView();

	const {
		status,
		data,
		error,
		isFetching,
		isFetchingNextPage,
		isFetchingPreviousPage,
		fetchNextPage,
		fetchPreviousPage,
		hasNextPage,
		hasPreviousPage,
	} = TreatCore.useInfiniteQuery({
		queryKey: ["sweetshopNFTsInfinite"],
		queryFn: ({pageParam = 1}) => getSweetshopNFTs(pageParam),
		getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
		getPreviousPageParam: (firstPage) => firstPage.prevPage ?? undefined,
	});

	/*
	const nfts =
		sweetshopNFTsLoading || sweetshopNFTsError
			? []
			: sweetshopNFTsData?.data
					.slice(0, 20)
					.map((post) => legacy_nft_to_new(post));
	*/

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
									<SelectableTag>
										<Text>
											<ImportantText>Free</ImportantText>
										</Text>
									</SelectableTag>
									<SelectableTag>
										<Text>
											<ImportantText>Sold out</ImportantText>
										</Text>
									</SelectableTag>
									<SelectableTag>
										<Text>
											<ImportantText>TOTM NFT</ImportantText>
										</Text>
									</SelectableTag>
									<SelectableTag>
										<Text>
											<ImportantText>Subscription NFT</ImportantText>
										</Text>
									</SelectableTag>
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
