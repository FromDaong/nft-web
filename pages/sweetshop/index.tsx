/* eslint-disable no-mixed-spaces-and-tabs */
import {SearchIcon, XIcon} from "@heroicons/react/outline";
import NFTSort from "@packages/Dropdowns/NFTDropdownSort";
import {TritPost} from "@packages/post/TritPost";
import {SEOHead} from "@packages/seo/page";
import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import {Input} from "@packages/shared/components/Input";
import Pagination from "@packages/shared/components/Pagination";
import {
	Heading,
	SmallText,
	Text,
} from "@packages/shared/components/Typography/Headings";
import {useDebounce} from "@packages/shared/hooks";
import {apiEndpoint, legacy_nft_to_new} from "@utils/index";
import axios from "axios";
import ApplicationFrame from "core/components/layouts/ApplicationFrame";
import ApplicationLayout from "core/components/layouts/ApplicationLayout";
import {useRouter} from "next/router";
import {TreatNFTsInfinityScrollingContainer} from "packages/shared/components/ListingSection";
import {useState} from "react";

export default function NFTS({sort, q, nfts, error}) {
	const posts = JSON.parse(nfts);
	const nft_posts = posts.docs;
	const router = useRouter();
	const [sortBy, setSortBy] = useState(sort);
	const [searchText, setSearchText] = useState(q);
	const search = useDebounce(searchText, 400);

	const setSort = (s) => {
		setSortBy(s);
		router.push({
			query: {
				...router.query,
				...{sort: s},
				page: 1,
			},
		});
	};

	const nextPage = () => {
		router.push({
			query: {
				...router.query,
				...{p: parseInt(posts.page) + +1},
			},
		});
	};

	const prevPage = () => {
		router.push({
			query: {
				...router.query,
				...{p: parseInt(posts.page) + +1},
			},
		});
	};

	const gotoPage = (page) => {
		router.push({query: {...router.query, p: page}});
	};

	const performSearchWithNewParams = (e) => {
		e.preventDefault();
		router.push({
			query: {
				...(sort ? {sort} : {sort: "3"}),
				...(search ? {q: search} : {}),
				...{p: 1},
			},
		});
	};

	return (
		<ApplicationLayout>
			<ApplicationFrame>
				<SEOHead title="Explore NFTs" />
				{!error && (
					<Container className="flex flex-col gap-12 py-12">
						<form
							onSubmit={performSearchWithNewParams}
							className="flex flex-col w-full gap-4 px-4"
						>
							<Container
								className="flex items-center w-full gap-1 px-2 py-1 rounded-lg"
								css={{
									backgroundColor: "$elementOnSurface",
								}}
							>
								<Input
									css={{
										padding: "8px 12px",
										borderRadius: "8px",
										backgroundColor: "transparent",
									}}
									placeholder={"Start typing to search for NFTs"}
									onChange={(e) => setSearchText(e.target.value)}
									value={searchText}
									className="flex-1"
								/>

								<Button
									type={"submit"}
									appearance={"subtle"}
								>
									<SearchIcon
										width={20}
										height={20}
									/>
								</Button>
							</Container>
							<Container className="flex gap-4 flex-noshrink">
								<NFTSort
									sort={sortBy}
									setSort={setSort}
								/>
							</Container>
							<Container className="flex gap-4">
								<Button
									appearance={"outline"}
									css={{borderRadius: "9999px", padding: "8px"}}
									className="transition-transform duration-200 shadow group group-hover:w-auto"
								>
									<SmallText>NSFW</SmallText>
									<Container>
										<Text>
											<XIcon
												height={16}
												width={16}
												className=" group-hover:flex"
											/>
										</Text>
									</Container>
								</Button>
								<Button
									appearance={"outline"}
									css={{borderRadius: "9999px", padding: "4px 8px"}}
									className="transition-transform duration-200 shadow group group-hover:w-auto"
								>
									<SmallText>Woman</SmallText>
									<Container>
										<Text>
											<XIcon
												height={16}
												width={16}
												className=" group-hover:flex"
											/>
										</Text>
									</Container>
								</Button>
							</Container>
						</form>

						<Container className="flex flex-col gap-8 px-4 xl:px-0">
							<TreatNFTsInfinityScrollingContainer>
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
							</TreatNFTsInfinityScrollingContainer>
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
				)}
			</ApplicationFrame>
		</ApplicationLayout>
	);
}

export const getServerSideProps = async (ctx) => {
	const {sort, q, p} = ctx.query;

	try {
		const res = await axios.get(
			`${apiEndpoint}/marketplace/activity?page=${p ?? 1}${
				sort ? "&sort=" + sort : ""
			}${q ? "&q=" + q : ""}`
		);

		const {data} = res.data;

		data.docs = data.docs.map((post) =>
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
