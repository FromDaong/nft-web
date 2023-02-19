/* eslint-disable no-mixed-spaces-and-tabs */
import {pagePropsConnectMongoDB} from "@db/engine/pagePropsDB";
import Error404 from "@packages/error/404";
import {TritPost} from "@packages/post/TritPost";
import {SEOHead} from "@packages/seo/page";
import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import {Divider} from "@packages/shared/components/Divider";
import {TreatNFTsInfinityScrollingContainer} from "@packages/shared/components/ListingSection";
import {Heading, Text} from "@packages/shared/components/Typography/Headings";
import {ImportantText} from "@packages/shared/components/Typography/Text";
import DynamicSkeleton from "@packages/skeleton";
import {TritPostSkeleton} from "@packages/skeleton/config";
import {apiEndpoint, legacy_nft_to_new} from "@utils/index";
import axios from "axios";
import UserAvatar from "core/auth/components/Avatar";
import ApplicationFrame from "core/components/layouts/ApplicationFrame";
import ApplicationLayout from "core/components/layouts/ApplicationLayout";
import TreatCore from "core/TreatCore";
import Link from "next/link";
import {useMemo} from "react";
import {MongoModelCollection} from "server/helpers/models";

const getNFTs = async (page: number, id: string) => {
	const res = await axios.get(
		`${apiEndpoint}/marketplace/collection/${id}/nfts?page=${page ?? 1}`
	);
	return res.data.data;
};

export default function Collection(props) {
	const collectionData = JSON.parse(props.data);
	const notFound = collectionData.notFound;

	const {
		data,
		isFetchingNextPage,
		fetchNextPage,
		hasNextPage,
		refetch,
		isFetching,
	} = TreatCore.useInfiniteQuery({
		queryKey: [`collectionNFTs:${collectionData.collection._id}`],
		queryFn: ({pageParam = 1}) => getNFTs(pageParam, collection._id),
		getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
		getPreviousPageParam: (firstPage) => firstPage.prevPage ?? undefined,
	});

	const pages = data ? data.pages : [];

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

	if (notFound) {
		return <Error404 />;
	}

	const {collection} = collectionData;

	return (
        <ApplicationLayout>
			<SEOHead title={collectionData.collection.name} />
			<ApplicationFrame>
				<Container className="flex flex-col gap-12 py-12">
					<Container>
						<Container className="flex justify-between gap-4">
							<Container className="flex flex-col gap-2">
								<Heading size="md">{collection.name}</Heading>
								<Container className="flex items-center gap-1">
									<Text>
										<ImportantText>
											Collection of {collection.nfts.length} NFTs by
										</ImportantText>{" "}
									</Text>
									<Link href={`/${collection.creator.username}`}>

                                        <Container className="flex gap-1">
                                            <UserAvatar size={24} />
                                            <Text className="underline">
                                                <ImportantText>
                                                    @{collection.creator.username}
                                                </ImportantText>
                                            </Text>
                                        </Container>

                                    </Link>
								</Container>
							</Container>
							{false && (
								<Container>
									<Container className="flex gap-4">
										<Button appearance={"surface"}>Bookmark</Button>
										<Button appearance={"surface"}>Share</Button>
									</Container>
								</Container>
							)}
						</Container>
						<Divider dir={"horizontal"} />
					</Container>

					<TreatNFTsInfinityScrollingContainer>
						{posts.length > 0
							? posts.map((nft) => (
									<div
										key={nft.id}
										className="col-span-1"
									>
										<TritPost
											inGrid
											{...nft}
										/>
									</div>
							  ))
							: collection.nfts.map((_, i) => (
									<Container
										key={i}
										className="col-span-1 border"
										css={{
											borderColor: "$subtleBorder",
											padding: "16px",
											borderRadius: "16px",
										}}
									>
										<DynamicSkeleton config={TritPostSkeleton} />
									</Container>
							  ))}
					</TreatNFTsInfinityScrollingContainer>
				</Container>
			</ApplicationFrame>
		</ApplicationLayout>
    );
}

export const getServerSideProps = async (ctx) => {
	const {_id} = ctx.params;

	await pagePropsConnectMongoDB();

	const collection = await MongoModelCollection.findById(_id)
		.populate("creator")
		.exec();

	if (!collection) {
		return {
			notFound: true,
		};
	}

	const returnObj = {
		id: collection._id,
		collection,
	};

	return {
		props: {
			data: JSON.stringify(returnObj),
		},
	};
};
