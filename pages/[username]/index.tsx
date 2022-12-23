/* eslint-disable no-mixed-spaces-and-tabs */
import Error404 from "@packages/error/404";
import Error500 from "@packages/error/500";
import RenderProfileNFTs from "@packages/post/profile/RenderProfileNFTs";
import {TritPost} from "@packages/post/TritPost";
import {SEOHead} from "@packages/seo/page";
import {Container} from "@packages/shared/components/Container";
import {Heading, Text} from "@packages/shared/components/Typography/Headings";
import {apiEndpoint, legacy_nft_to_new} from "@utils/index";
import axios from "axios";
import {useUser} from "core/auth/useUser";
import ApplicationFrame from "core/components/layouts/ApplicationFrame";
import ApplicationLayout from "core/components/layouts/ApplicationLayout";
import ProfileLayout from "core/components/layouts/ProfileLayout";
import TreatCore from "core/TreatCore";
import {useRouter} from "next/router";
import {useEffect, useMemo} from "react";
import {useInView} from "react-intersection-observer";
import {beforePageLoadGetUserProfile} from "server/page/userProfile";

export default function UserProfile(props: {
	error: boolean;
	notFound: boolean;
	data: any;
}) {
	if (props.notFound) {
		return <Error404 />;
	}

	if (props.error) {
		return <Error500 />;
	}

	const data = JSON.parse(props.data);
	const {username} = data;
	const {ref, inView} = useInView();
	const {profile} = useUser();

	const getcreatorNFTs = async (page) => {
		const res = await axios.get(
			`${apiEndpoint}/creator/${username}/subscription/nfts?page=${page}`
		);
		return res.data.data;
	};

	const {
		data: creatorNFTsData,
		isFetchingNextPage,
		fetchNextPage,
		hasNextPage,
		refetch,
		isFetching,
		error,
	} = TreatCore.useInfiniteQuery({
		queryKey: [`subscriptionNFTs:${username}`],
		queryFn: ({pageParam = 1}) => getcreatorNFTs(pageParam),
		getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
		getPreviousPageParam: (firstPage) => firstPage.prevPage ?? undefined,
	});

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
		<RenderProfileNFTs
			data={data}
			isFetching={isFetching}
			error={error}
			posts={posts}
			profile={profile ?? {}}
			username={username}
			ref={ref}
			fetchNextPage={fetchNextPage}
			isFetchingNextPage={isFetchingNextPage}
			hasNextPage={hasNextPage}
		/>
	);
}

// T-32 If username is not creator, redirect to collected immediately

export const getServerSideProps = beforePageLoadGetUserProfile;
