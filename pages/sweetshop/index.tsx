import SweetshopTabs from "@components/MarketPlace/MarketFilter";
import TagsFilter from "@components/MarketPlace/TagsFilter";
import SweetshopNFT from "@components/NFTCard/cards/Sweetshop";
import {SEOHead} from "@packages/seo/page";
import {Container} from "@packages/shared/components/Container";
import Pagination from "@packages/shared/components/Pagination";
import {usePaginatedPage} from "@packages/shared/components/Pagination/lib";
import {Heading} from "@packages/shared/components/Typography/Headings";
import {apiEndpoint, legacy_nft_to_new} from "@utils/index";
import axios from "axios";
import ApplicationFrame from "core/components/layouts/ApplicationFrame";
import ApplicationLayout from "core/components/layouts/ApplicationLayout";
import {MarketplaceListingsContainer} from "packages/shared/components/ListingSection";

export default function NFTS({sort, q, nfts, error}) {
	const posts = JSON.parse(nfts);
	const nft_posts = posts.docs;

	const {
		gotoPage,
		performSearchWithNewParams,
		prevPage,
		nextPage,
		searchText,
		sortBy,
		setSort,
		setSearchText,
	} = usePaginatedPage(posts, sort, q);

	return (
		<ApplicationLayout>
			<SweetshopTabs />
			<ApplicationFrame>
				<SEOHead title="Explore NFTs" />
				<TagsFilter />

				<Container className="relative flex w-full h-full gap-8">
					<Container className="flex-1 w-full">
						{!error && (
							<MarketplaceListingResults
								nft_posts={nft_posts}
								posts={posts}
								gotoPage={gotoPage}
								nextPage={nextPage}
								prevPage={prevPage}
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
					profile: post.creator_profile,
				},
				seller: {
					address: post.creator.address,
					profile_pic: post.creator_profile.profile_pic,
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

function MarketplaceListingResults({
	nft_posts,
	gotoPage,
	nextPage,
	prevPage,
	posts,
}) {
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
		</Container>
	);
}
