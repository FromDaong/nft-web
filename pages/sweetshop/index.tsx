/* eslint-disable no-mixed-spaces-and-tabs */
import SearchForm from "@components/MarketPlace/Listings/SearchForm";
import {Checkbox} from "@components/ui/checkbox";
import {SearchIcon} from "@heroicons/react/outline";
import NFTSort from "@packages/Dropdowns/NFTDropdownSort";
import {TritPost} from "@packages/post/TritPost";
import {SEOHead} from "@packages/seo/page";
import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import {Divider} from "@packages/shared/components/Divider";
import {Input} from "@packages/shared/components/Input";
import Pagination from "@packages/shared/components/Pagination";
import {usePaginatedPage} from "@packages/shared/components/Pagination/lib";
import {Heading, Text} from "@packages/shared/components/Typography/Headings";
import SweetshopTabs from "@packages/sweetshop/SweetshopTabs";
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

	console.log({error});

	return (
		<ApplicationLayout>
			<ApplicationFrame>
				<SEOHead title="Explore NFTs" />
				<Container className="relative flex w-full h-full gap-8 py-12">
					<ResultsFilter
						performSearchWithNewParams={performSearchWithNewParams}
						searchText={searchText}
						setSearchText={setSearchText}
						sortBy={sortBy}
					/>
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
					profile_pic: post.creator.profile_pic,
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

function ResultsFilter({
	performSearchWithNewParams,
	searchText,
	setSearchText,
	sortBy,
}) {
	return (
		<Container className="sticky top-0 flex-shrink-0 h-screen w-96">
			<Container
				css={{backgroundColor: "$surfaceOnSurface", borderColor: "$border"}}
				className="flex flex-col border shadow-sm rounded-xl h-fit"
			>
				<Container className="p-4 pb-2">
					<Heading size={"xss"}>Filters</Heading>
				</Container>
				<Divider />
				<SearchForm
					performSearchWithNewParams={performSearchWithNewParams}
					searchText={searchText}
					setSearchText={setSearchText}
				/>
				<Divider dir={"horizontal"} />
				<Container className="flex flex-col gap-2 p-4 flex-noshrink">
					<Heading size={"xss"}>Sort by</Heading>
					<NFTSort
						sort={sortBy}
						prefix={""}
					/>
				</Container>
				<Divider dir={"horizontal"} />
				<Container className="flex flex-col gap-4 p-4 flex-noshrink">
					<Heading size={"xss"}>Showing</Heading>
					<Container className="flex flex-col gap-2">
						<Container className="flex items-center justify-between gap-2">
							<label htmlFor="creator">
								<Text>From the creator</Text>
							</label>
							<Checkbox
								id="creator"
								required
							/>
						</Container>
						<Container className="flex items-center justify-between gap-2">
							<label htmlFor="resale">
								<Text>Secondary market</Text>
							</label>
							<Checkbox
								id="resale"
								required
							/>
						</Container>
						<Container className="flex items-center justify-between gap-2">
							<label htmlFor="totm">
								<Text>Treat of The Month</Text>
							</label>
							<Checkbox
								id="totm"
								required
							/>
						</Container>
					</Container>
				</Container>
				<Divider dir={"horizontal"} />
				<Container className="flex flex-col gap-2 p-4 flex-noshrink">
					<Heading size={"xss"}>Other filters</Heading>
					<Container className="flex items-center justify-between gap-2">
						<label htmlFor="soldOut">
							<Text>Show sold out</Text>
						</label>
						<Checkbox
							id="soldOut"
							required
						/>
					</Container>
				</Container>
				<Container className="p-4">
					<Button fullWidth>Show results</Button>
				</Container>
			</Container>
		</Container>
	);
}

function MarketplaceListingResults({
	nft_posts,
	gotoPage,
	nextPage,
	prevPage,
	posts,
}) {
	return (
		<Container className="flex flex-col gap-12">
			<Container className="flex flex-col gap-8 px-4 overflow-x-hidden">
				<MarketplaceListingsContainer>
					{nft_posts.length > 0 ? (
						nft_posts.map((nft) => (
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
					) : (
						<Container className="flex flex-col items-center col-span-1 py-24 md:col-span-2 xl:col-span-5">
							<Heading size="sm">No results found</Heading>
						</Container>
					)}
				</MarketplaceListingsContainer>
				<Pagination
					hasNextPage={posts.hasNextPage}
					hasPrevPage={posts.page - 1 > 0}
					gotoPage={gotoPage}
					page={posts.page}
					totalPages={+posts.totalPages}
					next={nextPage}
					prev={prevPage}
					nextPage={posts.page + +1}
					prevPage={posts.page - +1}
				/>
			</Container>
		</Container>
	);
}
