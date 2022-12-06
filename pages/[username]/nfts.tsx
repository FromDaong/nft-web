/* eslint-disable no-mixed-spaces-and-tabs */
import Error404 from "@packages/error/404";
import Error500 from "@packages/error/500";
import {SkeletonTritCollectiblePost, TritPost} from "@packages/post/TritPost";
import {TPost} from "@packages/post/types";
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
		return res.data;
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
			: creatorNFTsData?.data.map((post) => legacy_nft_to_new(post));

	return (
		<ApplicationLayout>
			<ApplicationFrame>
				<ProfileLayout userProfile={data}>
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
						{!creatorNFTError || !creatorNFTsLoading
							? creatorNFTs?.map((post: TPost) => (
									<TritPost
										key={post.id}
										{...post}
									/>
							  ))
							: [0, 1, 2].map((i) => (
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
					</div>
				</ProfileLayout>
			</ApplicationFrame>
		</ApplicationLayout>
	);
}

export const getServerSideProps = beforePageLoadGetUserProfile;
