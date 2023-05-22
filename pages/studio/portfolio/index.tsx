import StudioNavigation from "@components/CreatorDashboard/StudioNavigation";
import {
	CalendarIcon,
	DotsVerticalIcon,
	PaperAirplaneIcon,
} from "@heroicons/react/outline";
import {TritPostProps} from "@packages/post/types";
import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import {Heading, Text} from "@packages/shared/components/Typography/Headings";
import {
	ImportantText,
	SmallText,
} from "@packages/shared/components/Typography/Text";
import ListForSaleIcon from "@packages/shared/icons/ListForSale";
import RectangleStack from "@packages/shared/icons/RectangleStack";
import {MagnifyingGlassIcon} from "@radix-ui/react-icons";
import ApplicationFrame from "core/components/layouts/ApplicationFrame";
import ApplicationLayout from "core/components/layouts/ApplicationLayout";

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

export default function PortfolioPage() {
	return (
		<ApplicationLayout>
			<ApplicationFrame>
				<Container
					className="py-4 md:pt-0 px-4 lg:px-0 flex flex-col gap-4"
					css={{borderColor: "$border"}}
				>
					<Container className="flex justify-between items-baseline">
						<StudioNavigation />
					</Container>
				</Container>
				<Container
					css={{borderColor: "$border"}}
					className="flex justify-between gap-2 mt-8"
				>
					<Heading size={"sm"}>Portfolio</Heading>
					<Container className={"flex gap-2"}>
						<Button>
							<MagnifyingGlassIcon className="w-5 h-5" />
						</Button>
						<Button>
							<PaperAirplaneIcon className="w-5 h-5" />
							Send
						</Button>
						<Button>
							<ListForSaleIcon className="w-5 h-5" />
							List for sale
						</Button>
					</Container>
				</Container>
				<Container className="grid grid-cols-4 gap-8 mt-8">
					<OwnedNFTCard />
					<OwnedNFTCard />
					<OwnedNFTCard />
					<OwnedNFTCard />
					<OwnedNFTCard />
					<OwnedNFTCard />
					<OwnedNFTCard />
				</Container>
			</ApplicationFrame>
		</ApplicationLayout>
	);
}

function OwnedNFTCard({}) {
	return (
		<Container className="flex flex-col gap-4 rounded-xl bg-white p-4">
			<Container className="h-96 w-full bg-gray-200 rounded-xl" />
			<Container className="flex flex-col gap-1">
				<Container className="flex justify-between gap-4">
					<Heading
						size={"xss"}
						className="flex-1"
					>
						A weird but good name
					</Heading>
					<Button appearance={"unstyled"}>
						<DotsVerticalIcon className="w-5 h-5" />
					</Button>
				</Container>
				<Container className="flex gap-2 bg-gray-100 rounded-xl p-1 pr-2 items-center w-fit">
					<Container className="w-8 h-8 rounded-xl bg-white" />
					<SmallText className="uppercase">
						<ImportantText>The Legacy Collection</ImportantText>
					</SmallText>
				</Container>
				<Container className="flex gap-4 mt-4">
					<Container className="flex gap-2 items-center">
						<RectangleStack className="w-4 h-4" />
						<SmallText className="truncate line-clamp-1 text-ellipsis">
							4 owned
						</SmallText>
					</Container>
					<Text>&bull;</Text>
					<Container className="flex gap-2 items-center flex-1">
						<CalendarIcon className="w-4 h-4" />
						<SmallText>17 months ago</SmallText>
					</Container>
				</Container>
			</Container>
		</Container>
	);
}
