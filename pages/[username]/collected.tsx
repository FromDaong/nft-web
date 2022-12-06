/* eslint-disable no-mixed-spaces-and-tabs */
import Error404 from "@packages/error/404";
import Error500 from "@packages/error/500";
import {SkeletonTritCollectiblePost, TritPost} from "@packages/post/TritPost";
import {TPost} from "@packages/post/types";
import {SEOHead} from "@packages/seo/page";
import {Container} from "@packages/shared/components/Container";
import {apiEndpoint, legacy_nft_to_new} from "@utils/index";
import axios from "axios";
import ApplicationFrame from "core/components/layouts/ApplicationFrame";
import ApplicationLayout from "core/components/layouts/ApplicationLayout";
import ProfileLayout from "core/components/layouts/ProfileLayout";
import TreatCore from "core/TreatCore";
import {useRouter} from "next/router";
import {beforePageLoadGetUserProfile} from "server/page/userProfile";

const newCurated: TPost = {
	name: "Welcome to the Tritters",
	collection: {
		name: "Tritters",
		totalSupply: 10,
		minted: 4,
		avatar: "/assets/cherieCover.jpg",
	},
	/*image: {
    cdn: "/assets/cherieCover.jpg",
    ipfs: "/assets/cherieCover.jpg",
  },*/
	price: {
		value: 0.99,
		currency: "BNB",
	},
	id: "1",
	blurhash:
		"-qIFGCoMs:WBayay_NRjayj[ayj[IUWBayayj[fQIUt7j[ayayayj@WBRjoffkj[xuWBWCayj[ayWAt7fQj[ayayM{WBofj[j[fQ",
	post_type: "colletible",
	author: {
		username: "kamfeskaya",
		display_name: "Kamfes",
		avatar:
			"https://images.pexels.com/users/avatars/50964441/feyza-yildirim-157.jpeg?auto=compress&fit=crop&h=50&w=50&dpr=1",
	},
	timestamp: 782898893,
};

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
		queryKey: [`profileCollected:${username}`],
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
