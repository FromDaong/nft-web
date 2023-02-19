import {Container} from "@packages/shared/components/Container";
import {Heading, Text} from "@packages/shared/components/Typography/Headings";
import UserAvatar from "core/auth/components/Avatar";

const CreatorPreview = () => {
	const getMoreNFTsFromCreator = async () => {
		const res = await axios.get(
			`${apiEndpoint}/creator/${nft.creator.username}/sample`
		);
		return res.data.data;
	};

	const {
		isLoading: moreNFTSLoading,
		error: moreNFTSError,
		data: moreNFTs,
	} = TreatCore.useQuery({
		queryKey: [`moreNFTS:${nft.creator._id}`],
		queryFn: getMoreNFTsFromCreator,
	});
	return (
		<Container className="flex flex-col gap-12 px-8">
			<Container className="flex flex-col gap-4">
				<Heading size="sm">More from this creator</Heading>
			</Container>
			<Container className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				<Link href={`/${nft.creator.username}`}>
					<Container className="flex flex-col gap-8">
						<UserAvatar
							username={nft.creator.username}
							profile_pic={
								nft.creator.profile_pic ?? nft.creator.profile?.profile_pic
							}
							size={80}
						/>

						<Container className="flex flex-col gap-2">
							<Heading size="sm">{nft.name} </Heading>
							<Text>@{nft.creator.username}</Text>
						</Container>
						<Text>{nft.description}</Text>
					</Container>
				</Link>
				{!moreNFTSError && !moreNFTSLoading
					? moreNFTs
							.map((post) => legacy_nft_to_new(post))
							.slice(0, 3)
							.map((item) => (
								<TritPost
									key={item._id}
									inGrid
									{...item}
								/>
							))
					: [0, 1, 2].map((i) => (
							<DynamicSkeleton
								key={"skeleton2:" + i}
								config={TritPostSkeleton}
							/>
					  ))}
			</Container>
		</Container>
	);
};

export default CreatorPreview;
