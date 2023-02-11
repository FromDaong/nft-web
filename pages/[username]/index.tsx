/* eslint-disable no-mixed-spaces-and-tabs */
import Error404 from "@packages/error/404";
import Error500 from "@packages/error/500";
import RenderProfileNFTs from "@packages/post/profile/RenderProfileNFTs";
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
	p: number;
}) {
	const {data: session} = useSession();
	const data = props.data ? JSON.parse(props.data) : {};
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
	} = usePaginatedPage(nfts_data, "", "", true, {username}, props.p);

	if (props.notFound) {
		return <Error404 />;
	}

	if (props.error) {
		return <Error500 />;
	}

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
			page={nfts_data.page}
			hasNextPage={nfts_data.page < nfts_data.totalPages}
			totalPages={nfts_data.totalPages}
		/>
	);
}

export const getServerSideProps = async (ctx) => {
	await pagePropsConnectMongoDB();
	const {username} = ctx.query;
	const {p} = ctx.query;

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
						destination: `/${username}/`,
						permanent: false,
					},
				};
			}
		}

		const nfts_res = await axios.get(
			`${apiEndpoint}/creator/${username}/nfts?page=${p ?? 1}`
		);

		const {data: nfts_data} = nfts_res.data;

		nfts_data.docs = nfts_data.docs.map((post) =>
			legacy_nft_to_new({
				...post,
				price: post.price,
				_id: post._id,
				creator: {
					...post.creator,
					profile: post.creator.profile,
				},
				seller: {
					address: post.creator.address,
					profile_pic: post.creator.profile.profile_pic,
					username: post.creator.username,
					display_name: post.creator.profile.display_name,
					event_id: post._id,
				},
			})
		);

		const props = {
			p: nfts_data.page,
			nfts: JSON.stringify(nfts_data),
			data: JSON.stringify({...profile.toObject(), creator}),
		};

		return {
			props,
		};
	} catch (err) {
		return {
			props: {
				p: p ?? 1,
				nfts: JSON.stringify({docs: [], hasNextPage: false, totalPages: 1}),
				error: true,
				data: JSON.stringify({username}),
			},
		};
	}
};
