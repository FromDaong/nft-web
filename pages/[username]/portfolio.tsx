/* eslint-disable no-mixed-spaces-and-tabs */
import Error404 from "@packages/error/404";
import Error500 from "@packages/error/500";
import {SkeletonTritCollectiblePost, TritPost} from "@packages/post/TritPost";
import {TritPostProps} from "@packages/post/types";
import {SEOHead} from "@packages/seo/page";
import {Container} from "@packages/shared/components/Container";
import {Heading, Text} from "@packages/shared/components/Typography/Headings";
import Spinner from "@packages/shared/icons/Spinner";
import DynamicSkeleton from "@packages/skeleton";
import {TritPostSkeleton} from "@packages/skeleton/config";
import {apiEndpoint, legacy_nft_to_new} from "@utils/index";
import axios from "axios";
import ApplicationFrame from "core/components/layouts/ApplicationFrame";
import ApplicationLayout from "core/components/layouts/ApplicationLayout";
import ProfileLayout from "core/components/layouts/ProfileLayout";
import TreatCore from "core/TreatCore";
import {useSession} from "next-auth/react";
import {useRouter} from "next/router";
import {beforePageLoadGetUserProfile} from "server/page/userProfile";

export default function UserProfile(props: {
	error: boolean;
	notFound: boolean;
	data: any;
}) {
	const {data: session, status} = useSession();
	const data = JSON.parse(props.data);
	const {username} = data;
	const {profile} = (session as any) ?? {profile: {}};

	const getCollectedNFTs = async () => {
		const res = await axios.get(`${apiEndpoint}/profile/${username}/collected`);
		return res.data;
	};
	const {
		isLoading: creatorNFTsLoading,
		error: creatorNFTError,
		data: creatorNFTsData,
	} = TreatCore.useQuery({
		queryKey: [`profileCollected:${username}`],
		queryFn: getCollectedNFTs,
	});

	if (!session) {
		if (status === "loading") {
			return (
				<ApplicationFrame>
					<ApplicationLayout>
						<Container className="flex flex-col items-center justify-center h-screen w-screen">
							<Container className="flex flex-col items-center">
								<Container>
									<Spinner />
								</Container>
								<Heading className="text-2xl font-bold text-center">
									Loading``
								</Heading>
							</Container>
						</Container>
					</ApplicationLayout>
				</ApplicationFrame>
			);
		}

		return (
			<ApplicationFrame>
				<ApplicationLayout>
					<Container className="flex flex-col items-center justify-center h-full">
						<Heading className="text-2xl font-bold text-center">
							You need to be logged in to view this page
						</Heading>
					</Container>
				</ApplicationLayout>
			</ApplicationFrame>
		);
	}

	if (props.notFound) {
		return <Error404 />;
	}

	if (props.error) {
		return <Error500 />;
	}

	const collectedNFTs =
		creatorNFTsLoading || creatorNFTError
			? []
			: creatorNFTsData?.data.map((post) => legacy_nft_to_new(post));

	return (
		<ProfileLayout userProfile={data}>
			<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				{creatorNFTsLoading &&
					[0, 1, 2, 3].map((i) => (
						<Container key={i}>
							<DynamicSkeleton config={TritPostSkeleton} />
						</Container>
					))}

				{creatorNFTError && (
					<Container className="col-span-4 py-12 flex flex-col gap-2 items-center">
						<Heading size={"sm"}>Eish, an error!</Heading>
						<Text>
							That was an error. Please reload the page and try again.
						</Text>
					</Container>
				)}

				{collectedNFTs?.length === 0 && !creatorNFTsLoading && (
					<Container className="col-span-4 py-12 flex flex-col gap-2 items-center">
						<Heading size={"sm"}>Eish, not a collector.</Heading>
						<Text>This profile has not collected any Treat NFT's yet.</Text>
					</Container>
				)}

				{collectedNFTs &&
					collectedNFTs.map((post: TritPostProps) => (
						<TritPost
							key={post.id}
							{...post}
							noPrice
							isMine={username === profile.username}
						/>
					))}
			</div>
		</ProfileLayout>
	);
}

export const getServerSideProps = beforePageLoadGetUserProfile;
