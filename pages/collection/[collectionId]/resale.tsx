import NFTCollection from "@components/CreatorDashboard/NFTCollection";
import StudioNavigation from "@components/CreatorDashboard/StudioNavigation";
import {
	ArchiveIcon,
	CashIcon,
	ExternalLinkIcon,
	GiftIcon,
	HomeIcon,
	PencilIcon,
	PlusIcon,
	ShareIcon,
} from "@heroicons/react/outline";
import {TritPost} from "@packages/post/TritPost";
import {TritPostProps} from "@packages/post/types";
import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import {Divider} from "@packages/shared/components/Divider";
import {Heading, Text} from "@packages/shared/components/Typography/Headings";
import {ImportantText} from "@packages/shared/components/Typography/Text";
import {ArrowRightIcon} from "@radix-ui/react-icons";
import Avvvatars from "avvvatars-react";
import ApplicationFrame from "core/components/layouts/ApplicationFrame";
import ApplicationLayout from "core/components/layouts/ApplicationLayout";
import Link from "next/link";
import {useRouter} from "next/router";

const NFTs: Array<TritPostProps> = [
	{
		_id: "38893",
		author: {
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
				<Container
					css={{height: "80vh", backgroundColor: "$textContrast"}}
					className="flex flex-col gap-24 py-8 mt-8 rounded-xl justify-center items-center shadow-xl"
				>
					<Container className="flex flex-col gap-8 py-8 mt-8 rounded-xl justify-center items-center">
						<Container className={"rounded-2xl bg-white h-24 w-24"} />
						<Heading css={{color: "$white"}}>The collection title</Heading>
						<Container className="w-fit items-center px-4 py-4 rounded-full bg-white flex gap-4">
							<Avvvatars
								size={32}
								value={"a"}
							/>
							<Text>
								Created by <ImportantText>@tatenda</ImportantText>
							</Text>
						</Container>
						<Container className="p-8 grid grid-cols-3 gap-8 bg-white rounded-xl shadow">
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
				<Container className="flex gap-4 pt-8 mt-8">
					<Link href={`/collection/${collectionId}`}>
						<a>
							<Button appearance={"surface"}>
								<HomeIcon className="w-5 h-5" />
							</Button>
						</a>
					</Link>
					<Link href={`/collection/${collectionId}/resale`}>
						<a>
							<Button appearance={"link"}>
								<GiftIcon className="w-5 h-5" /> Resale Market
							</Button>
						</a>
					</Link>
					<Link href={`/collection/${collectionId}/sales`}>
						<a>
							<Button appearance={"link"}>
								<CashIcon className="w-5 h-5" /> Sales
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
