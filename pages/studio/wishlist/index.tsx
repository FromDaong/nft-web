import StudioNavigation, {
	TabNavigationLink,
} from "@components/CreatorDashboard/StudioNavigation";
import CreatedNFTsTable from "@components/CreatorDashboard/nfts/CreatedNFTsTable";
import {
	CalendarIcon,
	ChatAlt2Icon,
	DotsVerticalIcon,
	OfficeBuildingIcon,
	PaperAirplaneIcon,
	PhoneIncomingIcon,
	PlusIcon,
	ShoppingBagIcon,
	StarIcon,
	XIcon,
} from "@heroicons/react/outline";
import {TritPost} from "@packages/post/TritPost";
import {TritPostProps} from "@packages/post/types";
import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import {Divider} from "@packages/shared/components/Divider";
import {Heading, Text} from "@packages/shared/components/Typography/Headings";
import {
	BoldLink,
	ImportantText,
	SmallText,
} from "@packages/shared/components/Typography/Text";
import CoinsIcon from "@packages/shared/icons/CoinsIcon";
import ListForSaleIcon from "@packages/shared/icons/ListForSale";
import RectangleStack from "@packages/shared/icons/RectangleStack";
import {MagnifyingGlassIcon, StackIcon} from "@radix-ui/react-icons";
import Avvvatars from "avvvatars-react";
import ApplicationFrame from "core/components/layouts/ApplicationFrame";
import ApplicationLayout from "core/components/layouts/ApplicationLayout";

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

export default function WishlistPage() {
	return (
		<ApplicationLayout>
			<ApplicationFrame>
				<Container
					className="flex flex-col gap-4 px-4 py-4 md:pt-0 lg:px-0"
					css={{borderColor: "$border"}}
				>
					<Container className="flex items-baseline justify-between">
						<StudioNavigation />
					</Container>
				</Container>
				<Container
					css={{borderColor: "$border"}}
					className="flex justify-between gap-2 mt-8"
				>
					<Heading size={"sm"}>Wishlist</Heading>
					<Container className={"flex gap-2"}>
						<Button>
							<MagnifyingGlassIcon className="w-5 h-5" />
						</Button>
						<Button>
							<StarIcon className="w-5 h-5" />
							Add to wishlist
						</Button>
					</Container>
				</Container>
				<Container className="grid grid-cols-4 gap-8 mt-8">
					<WishlistNFTCard />
					<WishlistNFTCard />
					<WishlistNFTCard />
					<WishlistNFTCard />
					<WishlistNFTCard />
					<WishlistNFTCard />
					<WishlistNFTCard />
				</Container>
			</ApplicationFrame>
		</ApplicationLayout>
	);
}

type NFTProps = {
	name: string;
};

export function WishlistNFTCard() {
	return (
		<Container
			className="flex flex-col gap-4 p-4 rounded-xl"
			css={{backgroundColor: "$surfaceOnSurface"}}
		>
			<Container
				css={{backgroundColor: "$elementOnSurface"}}
				className="w-full h-96 rounded-xl"
			/>
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
				<Container
					css={{backgroundColor: "$elementOnSurface"}}
					className="flex items-center gap-2 p-1 pr-2 rounded-xl w-fit"
				>
					<Container
						css={{backgroundColor: "$surfaceOnSurface"}}
						className="w-8 h-8 rounded-xl"
					/>
					<SmallText className="uppercase">
						<ImportantText>The Legacy Collection</ImportantText>
					</SmallText>
				</Container>
				<Container className="flex justify-between gap-4 mt-4">
					<Button
						size={"sm"}
						appearance={"surface"}
					>
						<XIcon className="w-5 h-5" />
					</Button>
					<Button
						size={"sm"}
						appearance={"action"}
					>
						<CoinsIcon className={"w-5 h-5"} />
						Buy for 0.002 BNB
					</Button>
				</Container>
			</Container>
		</Container>
	);
}
