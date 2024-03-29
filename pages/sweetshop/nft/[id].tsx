/* eslint-disable no-mixed-spaces-and-tabs */
import ApplicationFrame from "../../../core/components/layouts/ApplicationFrame";
import {SEOHead} from "@packages/seo/page";
import ApplicationLayout from "../../../core/components/layouts/ApplicationLayout";
import axios from "axios";
import {apiEndpoint, legacy_nft_to_new} from "@utils/index";
import {useInView} from "react-intersection-observer";
import TreatCore from "../../../core/TreatCore";
import {useEffect, useMemo} from "react";
import {Container} from "@packages/shared/components/Container";
import {Heading} from "@packages/shared/components/Typography/Headings";
import {MarketplaceListingsContainer} from "@packages/shared/components/ListingSection";
import {TritPost} from "@packages/post/TritPost";
import DynamicSkeleton from "@packages/skeleton";
import {TritPostSkeleton} from "@packages/skeleton/config";
import {Button} from "@packages/shared/components/Button";

const getListingsByID = (id: string, page) => {
	return axios
		.get(`${apiEndpoint}/marketplace/nft/listings-by-id?id=${id}&page=${page}`)
		.then((res) => res.data.data);
};

export default function Address(props) {
	const {id} = props;

	const {ref, inView} = useInView();

	const {
		data,
		isFetchingNextPage,
		fetchNextPage,
		hasNextPage,
		refetch,
		isFetching,
	} = TreatCore.useInfiniteQuery({
		queryKey: [`sweetshopNFTsInfiniteByID:${id}`],
		queryFn: ({pageParam = 1}) => getListingsByID(id, pageParam),
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

	return (
		<ApplicationLayout>
			<ApplicationFrame>
				<SEOHead title={`Resale Listings for ID`} />
				<Container className={"flex py-12 px-4"}>
					<Heading size={"xs"}>Showing NFT's with the ID {id}</Heading>
				</Container>
				<Container className="flex flex-col gap-8 px-4 ">
					<Container className={isFetching ? "opacity-40" : ""}>
						<MarketplaceListingsContainer>
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
						</MarketplaceListingsContainer>
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
			</ApplicationFrame>
		</ApplicationLayout>
	);
}

export const getServerSideProps = async (ctx) => {
	const {id} = ctx.params;

	return {
		props: {
			id: id ?? null,
		},
	};
};
