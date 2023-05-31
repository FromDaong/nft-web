import StudioNavigation, {
	TabNavigationLink,
} from "@components/CreatorDashboard/StudioNavigation";
import CreatedNFTsTable from "@components/CreatorDashboard/nfts/CreatedNFTsTable";
import {
	ChatAlt2Icon,
	PaperAirplaneIcon,
	PlusIcon,
} from "@heroicons/react/outline";
import {TritPost} from "@packages/post/TritPost";
import {TritPostProps} from "@packages/post/types";
import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import {Divider} from "@packages/shared/components/Divider";
import {Heading, Text} from "@packages/shared/components/Typography/Headings";
import {BoldLink} from "@packages/shared/components/Typography/Text";
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

export default function ResalePage() {
	return (
		<ApplicationLayout>
			<StudioNavigation />
			<ApplicationFrame>
				<Container className="flex flex-col gap-2 mt-8">
					<Heading size={"sm"}>Resale listings</Heading>
				</Container>
			</ApplicationFrame>
		</ApplicationLayout>
	);
}
