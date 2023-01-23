/* eslint-disable no-mixed-spaces-and-tabs */
import {SearchIcon} from "@heroicons/react/outline";
import NFTDropdownSort from "@packages/Dropdowns/NFTDropdownSort";
import {TritPost} from "@packages/post/TritPost";
import {SEOHead} from "@packages/seo/page";
import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import {Input} from "@packages/shared/components/Input";
import Pagination from "@packages/shared/components/Pagination";
import {Heading} from "@packages/shared/components/Typography/Headings";
import {useDebounce} from "@packages/shared/hooks";
import {useQueryClient} from "@tanstack/react-query";
import {apiEndpoint, legacy_nft_to_new} from "@utils/index";
import axios from "axios";
import ApplicationFrame from "core/components/layouts/ApplicationFrame";
import ApplicationLayout from "core/components/layouts/ApplicationLayout";
import {NextPageContext} from "next";
import {useRouter} from "next/router";
import {TreatNFTsInfinityScrollingContainer} from "packages/shared/components/ListingSection";
import {useEffect, useState} from "react";

export default function NFTS({sort, q, p, nfts, error}) {
	const posts = JSON.parse(nfts);
	const nft_posts = posts.docs;
	const router = useRouter();
	const [page, setPage] = useState(p as number);
	const [, setSortBy] = useState<string>(sort as string);
	const [searchText, setSearchText] = useState(q as string);
	const search = useDebounce(searchText, 400);

	const nextPage = () => {
		setPage(page + +1);
		router.push({
			query: {
				...(sort ? {sort} : {sort: "3"}),
				...(search ? {q: search} : {}),
				...{p: page + +1},
			},
		});
	};

	const prevPage = () => {
		setPage(page + -1);
		router.push({
			query: {
				...(sort ? {sort} : {sort: "3"}),
				...(search ? {q: search} : {}),
				...{p: page + +1},
			},
		});
	};

	const performSearchWithNewParams = (e) => {
		e.preventDefault();
		router.reload();
	};

	// T-44 Implement search bar for sweetshop NFTs + filters with inspiration form Airbnb
	useEffect(() => {
		router.push(
			{
				query: {
					...(sort ? {sort} : {sort: "3"}),
					...(search ? {q: search} : {}),
					...{p: page},
				},
			},
			undefined,
			{
				shallow: true,
			}
		);

		if (!sort) {
			setSortBy("3");
		}
	}, [search, sort]);

	useEffect(() => {
		router.push(
			{
				query: {
					...(sort ? {sort} : {sort: "3"}),
					...(search ? {q: search} : {}),
					...{p: page},
				},
			},
			undefined,
			{
				shallow: true,
			}
		);
	}, [page]);

	const sortMap = ["Lowest price first", "Highest price first", "Newest first"];

	return (
		<ApplicationLayout>
			<ApplicationFrame>
				<SEOHead title="Explore NFTs" />
				{!error && (
					<Container className="flex flex-col gap-12 py-12">
						<form
							onSubmit={performSearchWithNewParams}
							className="flex flex-wrap items-center w-full gap-4 px-4"
						>
							<Container
								className="flex w-full max-w-xl rounded-lg"
								css={{
									backgroundColor: "$elementOnSurface",
								}}
							>
								<Input
									css={{
										width: "100%",
										padding: "8px 12px",
										borderRadius: "8px",
										backgroundColor: "transparent",
									}}
									placeholder={"Start typing to search for NFTs"}
									onChange={(e) => setSearchText(e.target.value)}
									value={searchText}
								/>
								<Button
									type={"submit"}
									css={{backgroundColor: "transparent", color: "$text"}}
								>
									<SearchIcon
										width={20}
										height={20}
									/>
								</Button>
							</Container>
							<Container className="flex flex-1 gap-4">
								<NFTDropdownSort
									sort={sort}
									setSort={setSortBy}
									label={sortMap[Number(sort ?? 3) - 1]}
								/>
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
								hasPrevPage={page - 1 > 0}
								gotoPage={(page) =>
									router.push({query: {...router.query, p: page}})
								}
								page={page}
								totalPages={+posts.totalPages}
								next={nextPage}
								prev={prevPage}
								nextPage={page + +1}
								prevPage={page - +1}
							/>
						</Container>
					</Container>
				)}
			</ApplicationFrame>
		</ApplicationLayout>
	);
}

export const getServerSideProps = async (ctx: NextPageContext) => {
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
		throw new TypeError("Oops, Server didn't return a reasonable response.");
	}
};
