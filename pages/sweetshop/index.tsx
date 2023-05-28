/* eslint-disable no-mixed-spaces-and-tabs */
import SearchForm from "@components/MarketPlace/Listings/SearchForm";
import SortBy from "@components/MarketPlace/SortByDropdownFilter";
import SweetshopNFT from "@components/NFTCard/cards/Sweetshop";
import {Checkbox} from "@components/ui/checkbox";
import {RadioGroup} from "@headlessui/react";
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
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import {apiEndpoint, legacy_nft_to_new} from "@utils/index";
import axios from "axios";
import ApplicationFrame from "core/components/layouts/ApplicationFrame";
import ApplicationLayout from "core/components/layouts/ApplicationLayout";
import {CircleSlash, PlusIcon, XIcon} from "lucide-react";
import {VeganIcon, Verified} from "lucide-react";
import {MarketplaceListingsContainer} from "packages/shared/components/ListingSection";
import {useMemo, useRef, useState} from "react";

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
			<ApplicationFrame>
				<SEOHead title="Explore NFTs" />
				<SweetshopTabs />
				<ManageSearchTags />

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

const ManageSearchTags = () => {
	const tags: React.MutableRefObject<string[]> = useRef([
		"Anime",
		"Artistic",
		"Cosplay",
		"Collectibles",
		"Comics",
		"Food",
		"Fashion",
		"Gaming",
		"Melon",
		"Movies",
		"Music",
		"Manga",
		"NSFW",
		"Pets",
		"Sports",
		"Travel",
		"Treat of the month",
		"TV",
	]);
	const [selectedTags, setSelectedTags] = useState<string[]>([]);
	const remainingTags: string[] = useMemo(
		() => tags.current.filter((t: string) => !selectedTags.includes(t)),
		[selectedTags]
	);

	const removeTag = (tag: string) => {
		setSelectedTags(selectedTags.filter((t: string) => t !== tag));
	};

	const addTag = (tag: string) => {
		if (selectedTags.includes(tag)) {
			alert("Tag already added");
			return;
		}

		setSelectedTags([...selectedTags, tag]);
	};

	return (
		<Container className="flex flex-col w-full gap-4 py-4">
			<Container className="flex flex-wrap gap-4">
				{selectedTags.map((tag) => (
					<Button
						key={tag}
						appearance={"link"}
						className="border shadow-sm"
						css={{paddingX: "8px", borderColor: "$subtleBorder"}}
						onClick={() => removeTag(tag)}
					>
						{tag}
						<XIcon className="w-4 h-4" />
					</Button>
				))}
			</Container>
			<Container className="flex justify-between w-full">
				<DropdownMenu>
					<DropdownMenuTrigger>
						<Button
							css={{padding: "8px"}}
							className="flex gap-4 rounded-lg"
							appearance={"surface"}
						>
							<PlusIcon className="w-5 h-5" />
							Add tags
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent className="z-50 w-64 p-2 overflow-x-hidden overflow-y-auto bg-white shadow-2xl rounded-xl max-h-96">
						{remainingTags.map((item) => (
							<DropdownMenuItem
								key={item}
								onClick={() => addTag(item)}
								className="p-2 rounded-lg cursor-pointer hover:bg-zinc-100"
							>
								<Text>
									<ImportantText>{item}</ImportantText>
								</Text>
							</DropdownMenuItem>
						))}
						{remainingTags.length === 0 && (
							<DropdownMenuItem className="flex flex-col items-center justify-center w-full h-full p-2">
								<MutedText>No more tags to add</MutedText>
							</DropdownMenuItem>
						)}
					</DropdownMenuContent>
				</DropdownMenu>
				<SortBy />
			</Container>
		</Container>
	);
};

function SweetshopTabs() {
	const [selectedTab, setSelectedTab] = useState("verified");
	return (
		<RadioGroup
			onSelect={(selected) => setSelectedTab(selected.target.value)}
			className="flex items-center w-full max-w-full gap-2 py-4 overflow-x-auto border-b flex-nowrap"
			defaultValue="verified"
		>
			<RadioGroup.Option
				appearance={selectedTab === "verified" ? "surface" : "subtle"}
				className="flex-shrink-0"
				value="verified"
				as={Button}
			>
				Verified creators
			</RadioGroup.Option>
			<RadioGroup.Option
				as={Button}
				appearance={selectedTab === "resale" ? "surface" : "subtle"}
				className="flex-shrink-0"
				value="resale"
			>
				Resale market
			</RadioGroup.Option>
			<RadioGroup.Option
				as={Button}
				appearance={selectedTab === "all" ? "surface" : "subtle"}
				className="flex-shrink-0"
				value="melon"
			>
				Melon
			</RadioGroup.Option>
			<RadioGroup.Option
				as={Button}
				appearance={selectedTab === "treat" ? "surface" : "subtle"}
				className="flex-shrink-0"
				value="treat"
			>
				Treat of The Month
			</RadioGroup.Option>
		</RadioGroup>
	);
}
