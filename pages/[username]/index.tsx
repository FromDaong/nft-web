/* eslint-disable no-mixed-spaces-and-tabs */
import Error404 from "@packages/error/404";
import Error500 from "@packages/error/500";
import RenderProfileNFTs from "@packages/post/profile/RenderProfileNFTs";
import {apiEndpoint, legacy_nft_to_new} from "@utils/index";
import axios from "axios";
import TreatCore from "core/TreatCore";
import {useSession} from "next-auth/react";
import {SocialProfileJsonLd} from "next-seo";
import {useEffect, useMemo} from "react";
import {useInView} from "react-intersection-observer";
import {beforePageLoadGetUserProfile} from "server/page/userProfile";

export default function UserProfile(props: {
	error: boolean;
	notFound: boolean;
	data: any;
}) {
	const {data: session} = useSession();
	const data = props.data ? JSON.parse(props.data) : {};
	const {username} = data;
	const {profile} = (session as any) ?? {profile: {}};
	const {ref, inView} = useInView();

	const getCollectedNFTs = async (page) => {
		const res = await axios.get(
			`${apiEndpoint}/creator/${username}/nfts?page=${page}`
		);
		return res.data.data;
	};

	const {
		data: creatorNFTsData,
		isFetchingNextPage,
		fetchNextPage,
		hasNextPage,
		isFetching,
		error,
	} = TreatCore.useInfiniteQuery({
		queryKey: [`creatorNFTs:${username}`],
		queryFn: ({pageParam = 1}) => getCollectedNFTs(pageParam),
		getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
		getPreviousPageParam: (firstPage) => firstPage.prevPage ?? undefined,
	});

	if (props.notFound) {
		return <Error404 />;
	}

	if (props.error) {
		return <Error500 />;
	}

	const pages = creatorNFTsData ? creatorNFTsData.pages : [];

	const posts = useMemo(() => {
		if (pages.length > 0) {
			return pages
				.map((page) => page.docs)
				.flat()
				.map((post) => legacy_nft_to_new(post));
		} else {
			return [];
		}
	}, [pages]);

	useEffect(() => {
		if (inView) {
			fetchNextPage();
		}
	}, [inView]);

	return (
		<>
			<RenderProfileNFTs
				data={data}
				isFetching={isFetching}
				error={error}
				posts={posts}
				profile={profile}
				username={username}
				ref={ref}
				fetchNextPage={fetchNextPage}
				isFetchingNextPage={isFetchingNextPage}
				hasNextPage={hasNextPage}
			/>
		</>
	);
}

export const getServerSideProps = beforePageLoadGetUserProfile;
