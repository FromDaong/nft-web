/* eslint-disable no-mixed-spaces-and-tabs */
import SearchForm from "@components/MarketPlace/Listings/SearchForm";
import {SearchIcon} from "@heroicons/react/outline";
import NFTSort from "@packages/Dropdowns/NFTDropdownSort";
import {TritResalePost} from "@packages/post/TritResalePost";
import {SEOHead} from "@packages/seo/page";
import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import {Input} from "@packages/shared/components/Input";
import Pagination from "@packages/shared/components/Pagination";
import {usePaginatedPage} from "@packages/shared/components/Pagination/lib";
import {Heading} from "@packages/shared/components/Typography/Headings";
import SweetshopTabs from "@packages/sweetshop/SweetshopTabs";
import {apiEndpoint} from "@utils/index";
import axios from "axios";
import ApplicationFrame from "core/components/layouts/ApplicationFrame";
import ApplicationLayout from "core/components/layouts/ApplicationLayout";
import {useEffect, useState} from "react";

export default function NFTS({sort, q, nfts, error}) {
	const posts = JSON.parse(nfts);
	const [nft_posts, setNFTPosts] = useState(posts.docs);

	useEffect(() => {
		const posts = JSON.parse(nfts);
		setNFTPosts(posts.docs);
	}, [nfts]);

	const {
		gotoPage,
		performSearchWithNewParams,
		prevPage,
		nextPage,
		searchText,
		sortBy,
		setSearchText,
	} = usePaginatedPage(posts, sort, q);

	return (
		<ApplicationLayout>
			<ApplicationFrame>
				<SEOHead title="Explore NFTs" />
				<SearchForm
					performSearchWithNewParams={performSearchWithNewParams}
					searchText={searchText}
					setSearchText={setSearchText}
				/>
				{!error && (
					<Container className="flex flex-col gap-12 py-12">
						<Container className="flex flex-col gap-8 px-4 overflow-x-hidden">
							<Container className="grid grid-cols-1 gap-8 md:grid-cols-2 place-content-center xl:grid-cols-4">
								{nft_posts.length > 0 &&
									nft_posts.map((nft) => (
										<div
											key={nft._id + "-" + nft.seller + "-" + nft.price}
											className="col-span-1"
										>
											<TritResalePost
												inGrid
												{...nft}
											/>
										</div>
									))}
								{nft_posts.length === 0 && (
									<Container className="flex flex-col items-center col-span-1 py-24 md:col-span-2 xl:col-span-5">
										<Heading size="sm">No results found</Heading>
									</Container>
								)}
							</Container>
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
				{error && (
					<Container className="flex flex-col gap-12 py-12">
						<Heading>An error occurred</Heading>
					</Container>
				)}
			</ApplicationFrame>
		</ApplicationLayout>
	);
}

// T-82 Page is not loading, suspect error coming from getServerSideProps
export const getServerSideProps = async (ctx) => {
	const {q, p} = ctx.query;
	const sort = ctx.query.sort ?? "3";

	try {
		const res = await axios.get(
			`${apiEndpoint}/marketplace/methods/open-orders-with-metadata-exhaustive?sort=${sort}&page=${
				p ?? 1
			}&q=${q}`
		);

		const {data} = res.data;

		return {
			props: {
				sort: sort ?? 3,
				q: q ?? "",
				p: p ?? 1,
				nfts: JSON.stringify(data),
			},
		};
	} catch (err) {
		console.log({err});
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
