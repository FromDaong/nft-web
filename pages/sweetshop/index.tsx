/* eslint-disable no-mixed-spaces-and-tabs */
import SearchForm from "@components/MarketPlace/Listings/SearchForm";
import SortBy from "@components/MarketPlace/SortByDropdownFilter";
import SweetshopNFT from "@components/NFTCard/cards/Sweetshop";
import {Checkbox} from "@components/ui/checkbox";
import {CalendarIcon, UserGroupIcon} from "@heroicons/react/outline";
import {Tag} from "@packages/post/BuyNFTPageViewNFT";
import {SEOHead} from "@packages/seo/page";
import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import {Divider} from "@packages/shared/components/Divider";
import Pagination from "@packages/shared/components/Pagination";
import {usePaginatedPage} from "@packages/shared/components/Pagination/lib";
import {Heading, Text} from "@packages/shared/components/Typography/Headings";
import {
	ImportantText,
	MutedText,
} from "@packages/shared/components/Typography/Text";
import {apiEndpoint, legacy_nft_to_new} from "@utils/index";
import axios from "axios";
import ApplicationFrame from "core/components/layouts/ApplicationFrame";
import ApplicationLayout from "core/components/layouts/ApplicationLayout";
import {CircleSlash} from "lucide-react";
import {VeganIcon, Verified} from "lucide-react";
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
				<Container className="flex items-center w-full max-w-full gap-2 py-4 overflow-x-scroll border-b flex-nowrap">
					<Button
						appearance={"surface"}
						className="flex-shrink-0"
					>
						<Verified className="w-4 h-4" />
						Verified creators
					</Button>
					<Button
						appearance={"subtle"}
						className="flex-shrink-0"
					>
						<UserGroupIcon className="w-4 h-4" />
						Secondary market
					</Button>
					<Button
						appearance={"subtle"}
						className="flex-shrink-0"
					>
						<VeganIcon className="w-4 h-4" />
						Melon
					</Button>
					<Button
						appearance={"subtle"}
						className="flex-shrink-0"
					>
						<CalendarIcon className="w-4 h-4" />
						Treat of The Month
					</Button>
				</Container>
				<Container className="relative flex w-full h-full gap-8">
					<Container className="flex-1 w-full">
						{!error && (
							<MarketplaceListingResults
								nft_posts={nft_posts}
								posts={posts}
								gotoPage={gotoPage}
								nextPage={nextPage}
								prevPage={prevPage}
								performSearchWithNewParams={performSearchWithNewParams}
								searchText={searchText}
								setSearchText={setSearchText}
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
	performSearchWithNewParams,
	searchText,
	setSearchText,
}) {
	return (
		<Container className="flex flex-col gap-8">
			<Container className="flex flex-col w-full">
				<Container className="flex flex-wrap justify-between w-full py-4 border-b md:flex-row">
					<Container className="flex flex-wrap items-center gap-4">
						<Button
							css={{padding: "4px 8px"}}
							className="flex gap-4 rounded-lg"
							appearance={"surface"}
						>
							<MutedText>Tags:</MutedText>
							<ImportantText
								className="flex"
								css={{color: "$textContrast", padding: 0}}
							>
								NSFW +1 more
							</ImportantText>
						</Button>
					</Container>
					<SortBy />
				</Container>
			</Container>
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
