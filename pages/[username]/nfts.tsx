/* eslint-disable no-mixed-spaces-and-tabs */
import Error404 from "@packages/error/404";
import Error500 from "@packages/error/500";
import {SkeletonTritCollectiblePost, TritPost} from "@packages/post/TritPost";
import {TritPostProps} from "@packages/post/types";
import {SEOHead} from "@packages/seo/page";
import {Container} from "@packages/shared/components/Container";
import {Heading, Text} from "@packages/shared/components/Typography/Headings";
import {apiEndpoint, legacy_nft_to_new} from "@utils/index";
import axios from "axios";
import ApplicationFrame from "core/components/layouts/ApplicationFrame";
import ApplicationLayout from "core/components/layouts/ApplicationLayout";
import ProfileLayout from "core/components/layouts/ProfileLayout";
import TreatCore from "core/TreatCore";
import {useRouter} from "next/router";
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

	const getcreatorNFTs = async () => {
		const res = await axios.get(`${apiEndpoint}/creator/${username}/nfts`);
		return res.data.data;
	};
	const {
		isLoading: creatorNFTsLoading,
		error: creatorNFTError,
		data: creatorNFTsData,
	} = TreatCore.useQuery({
		queryKey: [`creatorNfts:${username}`],
		queryFn: getcreatorNFTs,
	});

	const creatorNFTs =
		creatorNFTsLoading || creatorNFTError
			? []
			: creatorNFTsData?.docs.map((post) => legacy_nft_to_new(post));

	return (
		<ProfileLayout userProfile={data}>
			<Container className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
				{creatorNFTsLoading &&
					[0, 1, 2, 3].map((i) => (
						<Container
							key={i}
							className="col-span-1 border"
							css={{
								borderColor: "$subtleBorder",
								padding: "16px",
								borderRadius: "16px",
							}}
						>
							<SkeletonTritCollectiblePost />
						</Container>
					))}
				{creatorNFTs?.length > 0 && !creatorNFTsLoading ? (
					creatorNFTs?.map((post: TritPostProps) => (
						<TritPost
							key={post.id}
							{...post}
							noPrice
						/>
					))
				) : (
					<Container className="col-span-4 py-12 flex flex-col gap-2 items-center">
						<Heading size={"sm"}>Eish, not a treator.</Heading>
						<Text>This profile has not created any Treat NFT's yet.</Text>
					</Container>
				)}
				{creatorNFTError && (
					<Container className="col-span-4 py-12 flex flex-col gap-2 items-center">
						<Heading size={"sm"}>Eish, an error!</Heading>
						<Text>
							That was an error. Please reload the page and try again.
						</Text>
					</Container>
				)}
			</Container>
		</ProfileLayout>
	);
}

export const getServerSideProps = beforePageLoadGetUserProfile;
