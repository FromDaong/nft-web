import StudioNavigation from "@components/CreatorDashboard/StudioNavigation";
import {ExternalLinkIcon, PencilIcon, PlusIcon} from "@heroicons/react/outline";
import {TritPost} from "@packages/post/TritPost";
import {TritPostProps} from "@packages/post/types";
import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import {Divider} from "@packages/shared/components/Divider";
import {Heading, Text} from "@packages/shared/components/Typography/Headings";
import {ImportantText} from "@packages/shared/components/Typography/Text";
import Avvvatars from "avvvatars-react";
import ApplicationFrame from "core/components/layouts/ApplicationFrame";
import ApplicationLayout from "core/components/layouts/ApplicationLayout";
import Link from "next/link";
import {useRouter} from "next/router";

const NFTs: Array<TritPostProps> = [
	{
		_id: "38893",
		creator: {
			avatar: "https://picsum.photos/seed/picsum/300/300",
			display_name: "Chris",
			username: "tatenda",
			address: "0x0898239832",
			bio: "My bio is private",
		},
		id: "19",
		max_supply: 10,
		image: {
			cdn: "https://picsum.photos/seed/picsum/720/720",
			ipfs: "https://picsum.photos/seed/picsum/720/720",
		},
		post_type: "colletible",
		isSoldOut: true,
		collection: {
			avatar: "https://picsum.photos/seed/picsum/720/720",
			minted: 10,
			name: "My collection name",
			totalSupply: 60,
		},
		blurhash: "",
		name: "Trust the process",
		price: {
			currency: "BNB",
			value: 0.001,
		},
	},
];

export default function CollectionPage() {
	const router = useRouter();
	const {collectionId} = router.query;

	return (
		<ApplicationLayout>
			<ApplicationFrame>
				<Container className="flex flex-col gap-4 px-4 py-4 md:pt-0 lg:px-0">
					<Container className="flex items-baseline justify-between">
						<StudioNavigation />
					</Container>
				</Container>
				<Container className="flex justify-between pt-8 ">
					<Heading size={"md"}>The collection title</Heading>
					<Container className={"flex gap-4"}>
						<Button appearance={"surface"}>
							<PencilIcon className="w-5 h-5" /> Edit
						</Button>
						<Button>
							<ExternalLinkIcon className="w-5 h-5" /> Open in sweetshop
						</Button>
					</Container>
				</Container>
				<Container
					css={{height: "80vh", backgroundColor: "$textContrast"}}
					className="flex flex-col items-center justify-center gap-24 py-8 mt-8 rounded-xl"
				>
					<Container className="flex flex-col items-center justify-center gap-8 py-8 mt-8 rounded-xl">
						<Container className={"rounded-2xl bg-white h-24 w-24"} />
						<Heading css={{color: "$white"}}>The collection title</Heading>
						<Container className="flex items-center gap-4 px-4 py-4 bg-white rounded-full w-fit">
							<Avvvatars
								size={32}
								value={"a"}
							/>
							<Text>
								Created by <ImportantText>@tatenda</ImportantText>
							</Text>
						</Container>
						<Container className="grid grid-cols-3 gap-8 p-8 bg-white shadow rounded-xl">
							<Container className={"flex flex-col gap-2"}>
								<Text>
									<ImportantText>NFTs available</ImportantText>
								</Text>
								<Heading size={"sm"}>23</Heading>
							</Container>
							<Container className={"flex flex-col gap-2"}>
								<Text>
									<ImportantText>NFTs sold</ImportantText>
								</Text>
								<Heading size={"sm"}>10</Heading>
							</Container>
							<Container className={"flex flex-col gap-2"}>
								<Text>
									<ImportantText>Total sales</ImportantText>
								</Text>
								<Heading size={"sm"}>4.72 BNB</Heading>
							</Container>
						</Container>
					</Container>
				</Container>
				<Container className="flex justify-between gap-4 pt-8 mt-8">
					<Heading size={"sm"}>
						Collection NFTs ({Intl.NumberFormat().format(10)})
					</Heading>
					<Link href={`/create/${collectionId}`}>
						<a>
							<Button appearance={"surface"}>
								<PlusIcon className="w-5 h-5" /> Add NFTs to collection
							</Button>
						</a>
					</Link>
				</Container>
				<Divider dir={"horizontal"} />
				<Container className={"grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4"}>
					{NFTs.map((nft) => (
						<TritPost
							{...nft}
							key={nft.id}
						/>
					))}
				</Container>
			</ApplicationFrame>
		</ApplicationLayout>
	);
}

function ContentCollectionPreview({NFTs}) {
	return (
		<Container className="flex flex-col gap-12 my-12">
			<Container
				className={"flex flex-row-reverse lg:flex-row justify-between"}
			>
				<Container className={"w-full lg:w-1/3"}>
					<Container className={"flex flex-col gap-2"}>
						<Heading>TreatDAO Content Fanpack</Heading>
						<Text>
							Tech Dinner Series (TDS) connects founders, investors, operators &
							developers over selectively curated and intimate dinner & drinks
							happy hour experiences across New York City, San Francisco, &
							Seattle.
						</Text>
					</Container>

					<Button
						appearance={"surface"}
						className={"mt-8"}
					>
						Go to collection
					</Button>
				</Container>
				<Container
					className={
						"aspect-square w-full lg:w-48 lg:h-auto bg-gray-200 max-h-48 max-w-48 rounded-xl"
					}
				></Container>
			</Container>
			<Container
				className={"grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-8"}
			>
				{NFTs.map((nft) => (
					<TritPost
						{...nft}
						key={nft.id}
					/>
				))}
			</Container>
		</Container>
	);
}
