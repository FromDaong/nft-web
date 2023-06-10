import StudioNavigation from "@components/CreatorDashboard/StudioNavigation";
import {DotsVerticalIcon, StarIcon, XIcon} from "@heroicons/react/outline";
import {TritPostProps} from "@packages/post/types";
import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import {Heading} from "@packages/shared/components/Typography/Headings";
import {
	ImportantText,
	SmallText,
} from "@packages/shared/components/Typography/Text";
import CoinsIcon from "@packages/shared/icons/CoinsIcon";
import ApplicationFrame from "core/components/layouts/ApplicationFrame";
import ApplicationLayout from "core/components/layouts/ApplicationLayout";

export default function WishlistPage() {
	return (
		<ApplicationLayout>
			<ApplicationFrame>
				<Container
					css={{borderColor: "$border"}}
					className="flex justify-between flex-col md:flex-row gap-4 mt-8"
				>
					<Heading size={"sm"}>Wishlist</Heading>
					<Container className={"flex gap-2"}>
						<Button
							outlined
							appearance={"surface"}
						>
							<StarIcon className="w-5 h-5" />
							Add to wishlist
						</Button>
					</Container>
				</Container>
				<Container className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-8">
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
