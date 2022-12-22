/* eslint-disable no-mixed-spaces-and-tabs */
import {ArrowRightIcon} from "@heroicons/react/outline";
import Error404 from "@packages/error/404";
import Error500 from "@packages/error/500";
import {SkeletonTritCollectiblePost, TritPost} from "@packages/post/TritPost";
import {TritPostProps} from "@packages/post/types";
import {SEOHead} from "@packages/seo/page";
import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import {Heading, Text} from "@packages/shared/components/Typography/Headings";
import DynamicSkeleton from "@packages/skeleton";
import {CollectionSkeleton, TritPostSkeleton} from "@packages/skeleton/config";
import {apiEndpoint, legacy_nft_to_new} from "@utils/index";
import axios from "axios";
import ApplicationFrame from "core/components/layouts/ApplicationFrame";
import ApplicationLayout from "core/components/layouts/ApplicationLayout";
import ProfileLayout from "core/components/layouts/ProfileLayout";
import TreatCore from "core/TreatCore";
import Link from "next/link";
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

	const getCollections = async () => {
		const res = await axios.get(
			`${apiEndpoint}/profile/${username}/collections`
		);
		return res.data.data;
	};

	const {
		isLoading: collectionsLoading,
		error: collectionsError,
		data: collectionsData,
	} = TreatCore.useQuery({
		queryKey: [`collections:${username}`],
		queryFn: getCollections,
	});

	return (
		<ProfileLayout userProfile={data}>
			<Container className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
				{collectionsLoading && <DynamicSkeleton config={CollectionSkeleton} />}
				{collectionsError && <Error500 />}
				{collectionsData &&
					collectionsData.docs.map((collection) => (
						<Link
							key={collection._id}
							href={`/collection/${collection._id}`}
						>
							<a>
								<CollectionsPreview
									key={`collection:${collection._id}}`}
									nfts={collection.nfts}
									creator={data}
									collection={collection}
								/>
							</a>
						</Link>
					))}
			</Container>
		</ProfileLayout>
	);
}

const CollectionsPreview = ({
	nfts,
	creator,
	collection,
}: {
	nfts: Array<any>;
	creator: any;
	collection: any;
}) => {
	console.log({collection});
	return (
		<Container className="flex flex-col gap-12">
			<Container
				key={collection._id}
				className="flex flex-col gap-4 border shadow-sm relative overflow-clip"
				css={{
					borderRadius: "32px",
					backgroundColor: "$surfaceOnSurface",
					borderolor: "$subtleBorder",
				}}
			>
				<Container className="absolute top-4 right-4">
					{collection.isSubscription && (
						<Container className="flex">
							<Button appearance={"accent"}>For subscribers only</Button>
						</Container>
					)}
				</Container>
				<Container className="relative">
					<GridBoxes />
				</Container>
				<Container
					className="p-4 mt-2 flex flex-col gap-4"
					css={{backgroundColor: "$elementSurface"}}
				>
					<Container className="flex justify-between px-4">
						<Container className="flex flex-col gap-1">
							<Heading size="xss">{collection.name}</Heading>
							<Text>
								Created by @{creator.username} with {nfts.length} NFTs
							</Text>
						</Container>
					</Container>
					<Container className="px-4 pb-2 flex">
						<Button
							fullWidth
							appearance={"subtle"}
						>
							<Text>Go to collection</Text>
							<Text>
								<ArrowRightIcon
									height={16}
									width={16}
								/>
							</Text>
						</Button>
					</Container>
				</Container>
			</Container>
		</Container>
	);
};

const GridBoxes = () => {
	return (
		<Container className="mx-auto max-w-xl">
			<Container className="relative z-0">
				<Container
					className="gradient-mask absolute inset-0 h-full w-full"
					css={{
						background:
							"radial-gradient(transparent 0%, $surfaceOnSurface 70%)",
					}}
				></Container>
				<Container className="z-0 grid grid-cols-6 grid-rows-6 border border-purple-500/20">
					<Container className="aspect-square border border-purple-500/20"></Container>
					<Container className="aspect-square border border-purple-500/20"></Container>
					<Container className="aspect-square border border-purple-500/20"></Container>
					<Container className="aspect-square border border-purple-500/20"></Container>
					<Container className="aspect-square border border-purple-500/20"></Container>
					<Container className="aspect-square border border-purple-500/20"></Container>
					<Container className="aspect-square border border-purple-500/20"></Container>
					<Container className="aspect-square border border-purple-500/20"></Container>
					<Container className="aspect-square border border-purple-500/20"></Container>
					<Container className="aspect-square border border-purple-500/20 bg-gray-900/5"></Container>
					<Container className="aspect-square border border-purple-500/20"></Container>
					<Container className="aspect-square border border-purple-500/20"></Container>
					<Container className="aspect-square border border-purple-500/20"></Container>
					<Container className="aspect-square border border-purple-500/20"></Container>
					<Container className="aspect-square border border-purple-500/20"></Container>
					<Container className="aspect-square border border-purple-500/20"></Container>
					<Container className="aspect-square border border-purple-500/20"></Container>
					<Container className="aspect-square border border-purple-500/20"></Container>
					<Container className="aspect-square border border-purple-500/20"></Container>
					<Container className="aspect-square border border-purple-500/20"></Container>
					<Container className="aspect-square border border-purple-500/20 bg-gray-900/5"></Container>
					<Container className="aspect-square border border-purple-500/20"></Container>
					<Container className="aspect-square border border-purple-500/20"></Container>
					<Container className="aspect-square border border-purple-500/20"></Container>
					<Container className="aspect-square border border-purple-500/20"></Container>
					<Container className="aspect-square border border-purple-500/20"></Container>
					<Container className="aspect-square border border-purple-500/20"></Container>
					<Container className="aspect-square border border-purple-500/20"></Container>
					<Container className="aspect-square border border-purple-500/20 bg-gray-900/5"></Container>
					<Container className="aspect-square border border-purple-500/20"></Container>
					<Container className="aspect-square border border-purple-500/20"></Container>
					<Container className="aspect-square border border-purple-500/20 bg-gray-900/5"></Container>
					<Container className="aspect-square border border-purple-500/20"></Container>
					<Container className="aspect-square border border-purple-500/20"></Container>
					<Container className="aspect-square border border-purple-500/20"></Container>
					<Container className="aspect-square border border-purple-500/20"></Container>
				</Container>
			</Container>
		</Container>
	);
};

export const getServerSideProps = beforePageLoadGetUserProfile;
