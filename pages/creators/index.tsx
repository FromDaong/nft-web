/* eslint-disable no-mixed-spaces-and-tabs */
import {SearchIcon} from "@heroicons/react/outline";
import CreatorsDropdownSort from "@packages/Dropdowns/CreatorsDropdownSort";
import SuggestedCreatorCard from "@packages/feed/components/SuggestedCreatorCard";
import {SEOHead} from "@packages/seo/page";
import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import {Input} from "@packages/shared/components/Input";
import Pagination from "@packages/shared/components/Pagination";
import {Heading} from "@packages/shared/components/Typography/Headings";
import {useDebounce} from "@packages/shared/hooks";
import {apiEndpoint} from "@utils/index";
import axios from "axios";
import ApplicationFrame from "core/components/layouts/ApplicationFrame";
import ApplicationLayout from "core/components/layouts/ApplicationLayout";
import {useRouter} from "next/router";
import {useState} from "react";

const getSweetshopNFTs = async (page: number, search: string) => {
	const res = await axios.get(
		`${apiEndpoint}/creator/all?page=${page ?? 1}${
			search ? "&q=" + search : ""
		}`
	);
	return res.data.data;
};

export default function NFTS(props) {
	const results = JSON.parse(props.creators);
	const creators = results.docs;
	const router = useRouter();
	const [searchText, setSearchText] = useState(
		(router.query.q ?? "") as string
	);
	const search = useDebounce(searchText, 400);
	const [sortBy, setSortBy] = useState<string>(router.query.sort as string);

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
				...{p: parseInt(results.page) + +1},
			},
		});
	};

	const prevPage = () => {
		router.push({
			query: {
				...router.query,
				...{p: parseInt(results.page) + +1},
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
				...(sortBy ? {sort: sortBy} : {sort: "3"}),
				...(search ? {q: search} : {}),
				...{p: 1},
			},
		});
	};

	const sort_labels_map = [
		"A-Z",
		"Z-A",
		"Most followers",
		"Least followers",
		"Most NFTs",
		"Least NFTs",
	];

	return (
		<ApplicationLayout>
			<ApplicationFrame>
				<SEOHead title="Explore Creators" />
				<Container className="flex flex-col gap-12 py-12">
					<Container className="flex flex-wrap items-center w-full gap-4 px-4">
						<form
							onSubmit={performSearchWithNewParams}
							className="flex flex-col w-full gap-4"
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
									placeholder={"Start typing to search for creators"}
									onChange={(e) => setSearchText(e.target.value)}
									value={searchText}
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
						</form>
						<CreatorsDropdownSort
							sort={sortBy}
							setSort={setSort}
							label={sort_labels_map[parseInt(sortBy) - 1]}
						/>
					</Container>
					<Container className="flex flex-col gap-8 px-4 ">
						<Container
							className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8`}
						>
							{creators.length > 0 ? (
								creators.map((creator) => (
									<SuggestedCreatorCard
										key={creator._id}
										username={creator.username}
										display_name={creator.profile?.display_name}
										avatar={creator.profile?.profile_pic}
										bio={creator.profile?.bio}
										isExpanded
										border
										live={creator.livestream_active}
										followers={creator.profile?.followers?.length}
										subscribers={creator.profile?.following?.length}
									/>
								))
							) : (
								<Container className="flex flex-col items-center col-span-1 py-24 md:col-span-2 lg:col-span-3 xl:col-span-4">
									<Heading size="sm">No results found</Heading>
								</Container>
							)}
						</Container>
						<Pagination
							hasNextPage={results.hasNextPage}
							hasPrevPage={results.page - 1 > 0}
							gotoPage={gotoPage}
							page={results.page}
							totalPages={+results.totalPages}
							next={nextPage}
							prev={prevPage}
							nextPage={results.page + +1}
							prevPage={results.page - +1}
						/>
					</Container>
				</Container>
			</ApplicationFrame>
		</ApplicationLayout>
	);
}

export const getServerSideProps = async (ctx) => {
	const {sort, q, p} = ctx.query;

	try {
		const res = await axios.get(
			`${apiEndpoint}/creator/all?page=${p ?? 1}${q ? "&q=" + q : ""}`
		);

		const {data} = res.data;

		return {
			props: {
				sort: sort ?? 3,
				q: q ?? "",
				p: p ?? 1,
				creators: JSON.stringify(data),
			},
		};
	} catch (err) {
		return {
			props: {
				sort: sort ?? 3,
				q: q ?? "",
				p: p ?? 1,
				creators: JSON.stringify({docs: [], hasNextPage: false, totalPages: 1}),
				error: true,
			},
		};
	}
};
