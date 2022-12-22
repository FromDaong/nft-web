import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import {Heading, Text} from "@packages/shared/components/Typography/Headings";
import DynamicSkeleton from "@packages/skeleton";
import {TritPostSkeleton} from "@packages/skeleton/config";
import ProfileLayout from "core/components/layouts/ProfileLayout";
import {TritPost} from "../TritPost";
import {TritPostProps} from "../types";

const RenderProfileNFTs = ({
	data,
	isFetching,
	error,
	posts,
	profile,
	username,
	ref,
	fetchNextPage,
	isFetchingNextPage,
	hasNextPage,
}) => {
	// T-25 implement a reasonable empty state design

	return (
		<ProfileLayout userProfile={data}>
			<div className="grid grid-cols-1 gap-12">
				{isFetching &&
					[0, 1, 2, 3].map((i) => (
						<Container
							key={i}
							className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
						>
							<Container>
								<DynamicSkeleton config={TritPostSkeleton} />
							</Container>
						</Container>
					))}

				{error && (
					<Container className="col-span-4 py-12 flex flex-col gap-2 items-center">
						<Heading size={"sm"}>Eish, an error!</Heading>
						<Text>
							That was an error. Please reload the page and try again.
						</Text>
					</Container>
				)}

				{posts.length === 0 && !isFetching && !error && (
					<Container className="col-span-4 py-12 flex flex-col gap-2 items-center">
						<Heading size={"sm"}>Eish, not a collector.</Heading>
						<Text>This profile has not collected any Treat NFT's yet.</Text>
					</Container>
				)}

				{posts && (
					<>
						<Container className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
							{posts.map((post: TritPostProps) => (
								<TritPost
									key={post.id}
									{...post}
									noPrice
									isMine={username === profile.username}
								/>
							))}
						</Container>
						<Container className="flex justify-center w-full">
							<Button
								appearance={"surface"}
								ref={ref}
								onClick={() => fetchNextPage()}
								disabled={!hasNextPage || isFetchingNextPage}
							>
								{isFetchingNextPage
									? "Loading more..."
									: hasNextPage
									? "Load more"
									: "Nothing more to load"}
							</Button>
						</Container>
					</>
				)}
			</div>
		</ProfileLayout>
	);
};

export default RenderProfileNFTs;
