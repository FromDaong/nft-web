import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import Pagination from "@packages/shared/components/Pagination";
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
	fetchNextPage,
	isFetchingNextPage,
	hasNextPage,
	hideSeller,
	hidePrice,
}: {
	[key: string]: any;
	hideSeller?: boolean;
	hidePrice?: boolean;
}) => {
	// T-25 implement a reasonable empty state design

	return (
		<ProfileLayout userProfile={data}>
			{
				<Container className="flex flex-col w-full">
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

					{posts.length === 0 && !isFetching && !error && (
						<Container className="flex flex-col items-center col-span-4 gap-2 py-12 text-center">
							<Heading size={"sm"}>Eish, we found nothing.</Heading>
							<Text>The query returned no results from the server.</Text>
						</Container>
					)}
				</Container>
			}
			{!posts && error && (
				<Container className="flex flex-col items-center col-span-4 gap-2 py-12 text-center">
					<Heading size={"sm"}>Eish, an error!</Heading>
					<Text>That was an error. Please reload the page and try again.</Text>
				</Container>
			)}
			<Container>
				{posts && (
					<>
						<Container className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
							{posts.map((post: TritPostProps) => (
								<TritPost
									key={post.id}
									{...post}
									noPrice={hidePrice}
									isMine={username === profile.username}
									hideSeller={hideSeller}
								/>
							))}
						</Container>
						<Pagination
							page={1}
							totalPages={1}
							gotoPage={() => {}}
						/>
					</>
				)}
			</Container>
		</ProfileLayout>
	);
};

export default RenderProfileNFTs;
