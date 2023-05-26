/* eslint-disable no-mixed-spaces-and-tabs */
import PortfolioPublicListingCard from "@components/NFTCard/cards/PortfolioListingCard";
import Error404 from "@packages/error/404";
import Error500 from "@packages/error/500";
import RenderProfileNFTs from "@packages/post/profile/RenderProfileNFTs";
import {TritPortfolioPost} from "@packages/post/TritPortfolioPost";
import {usePaginatedPage} from "@packages/shared/components/Pagination/lib";
import {apiEndpoint, legacy_nft_to_new} from "@utils/index";
import axios from "axios";
import {useSession} from "next-auth/react";
import {pagePropsConnectMongoDB} from "server/helpers/core/pagePropsDB";
import {MongoModelCreator, MongoModelProfile} from "server/helpers/models";

export default function UserProfile(props: {
	error: boolean;
	notFound: boolean;
	data: any;
	nfts: any;
	sort: any;
	q: any;
	p: number;
}) {
	const {data: session} = useSession();
	const data = JSON.parse(props.data);
	const {username} = data;
	const {profile} = (session as any) ?? {profile: {}};
	const nfts_data = JSON.parse(props.nfts);

	const {
		gotoPage,
		performSearchWithNewParams,
		prevPage,
		nextPage,
		searchText,
		sortBy,
		setSort,
		setSearchText,
	} = usePaginatedPage(nfts_data, props.sort, true, {username}, props.p);

	if (props.notFound) {
		return <Error404 />;
	}

	if (props.error) {
		return <Error500 />;
	}

	if (props.notFound) {
		return <Error404 />;
	}

	if (props.error) {
		return <Error500 />;
	}

	const totalPages = Math.ceil(nfts_data.total / 100);

	return (
		<RenderProfileNFTs
			data={data}
			posts={nfts_data.docs}
			error={props.error}
			profile={profile}
			username={username}
			nextPage={nextPage}
			prevPage={prevPage}
			gotoPage={gotoPage}
			performSearchWithNewParams={performSearchWithNewParams}
			searchText={searchText}
			sortBy={sortBy}
			setSort={setSort}
			setSearchText={setSearchText}
			hideSeller
			hidePrice
			hideSoldOut
			page={nfts_data.page}
			hasNextPage={nfts_data.page < totalPages}
			totalPages={totalPages}
			Component={PortfolioPublicListingCard}
		/>
	);
}

export const getServerSideProps = async (ctx) => {
	await pagePropsConnectMongoDB();
	const {username} = ctx.query;
	const {q, p, cursor} = ctx.query;
	const sort = ctx.query.sort ?? "";

	try {
		const profile = await MongoModelProfile.findOne({username}).exec();

		if (!profile) {
			return {
				props: {
					notFound: true,
					error: true,
				},
			};
		}

		const creator = await MongoModelCreator.findOne({username}).exec();
		if (!creator) {
			if (ctx.resolvedUrl === `/${username}`) {
				return {
					redirect: {
						destination: `/${username}/portfolio`,
						permanent: false,
					},
				};
			}
		}

		const nfts_res = await axios.get(
			`${apiEndpoint}/profile/${username}/collected?p=${p ?? 1}${
				"&sort=" + sort
			}${q ? "&q=" + q : ""}${cursor ? `&cursor=${cursor}` : ""}&limit=24`
		);

		const {data: nfts_data} = nfts_res.data;

		console.log(nfts_data.base);
		nfts_data.docs = nfts_data.docs.map((post, i) =>
			legacy_nft_to_new({
				...post,
				price: post.price,
				_id: post._id,
				creator: {
					...post.creator,
					profile: post.creator?.profile,
				},
				seller: {
					address: post.creator?.address,
					profile_pic: post.creator.profile?.profile_pic,
					username: post.creator?.username,
					display_name: post.creator.profile?.display_name,
					event_id: post._id,
				},
				count: nfts_data.base[i].amount,
				image: post.image ?? {},
			})
		);

		const props = {
			sort: sort ?? 3,
			q: q ?? "",
			p: nfts_data.page,
			nfts: JSON.stringify(nfts_data),
			data: JSON.stringify({...profile.toObject(), creator}),
		};

		return {
			props,
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
				data: JSON.stringify({username}),
			},
		};
	}
};
