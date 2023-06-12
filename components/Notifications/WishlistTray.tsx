import {NFTCard} from "@components/NFTCard";
import {useMyWishlist, useWishlist} from "@packages/chain/hooks/useWishlist";
import {
	DropdownContainer,
	DropdownContent,
	NavDropdownItem,
} from "@packages/navigation/components/DropdownContainer";
import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import {Heading} from "@packages/shared/components/Typography/Headings";
import {
	BoldLink,
	ImportantText,
	SmallText,
	Text,
} from "@packages/shared/components/Typography/Text";
import Spinner from "@packages/shared/icons/Spinner";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {ShoppingBag, TrashIcon} from "lucide-react";
import Link from "next/link";
import {useAccount} from "wagmi";

export default function WishlistTray() {
	const {address} = useAccount();
	const {isLoading, wishlist} = useMyWishlist(address);

	console.log({wishlist});

	return (
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				<Container>
					<Button
						css={{
							padding: "0.5rem",
						}}
						appearance={"surface"}
					>
						<ShoppingBag className={"w-5 h-5"} />
					</Button>
				</Container>
			</DropdownMenu.Trigger>
			<DropdownMenu.Portal>
				<DropdownContent>
					<DropdownContainer className="shadow-2xl min-w-72 w-72 p-2 flex flex-col overflow-y-auto max-h-[32rem]">
						<DropdownMenu.DropdownMenuGroup className="flex flex-col gap-2 pt-2 p-2">
							<Heading size={"xss"}>Wishlist</Heading>
						</DropdownMenu.DropdownMenuGroup>
						{!isLoading && wishlist?.length !== 0 && (
							<DropdownMenu.DropdownMenuGroup className="flex flex-col gap-4 p-1 my-2 ">
								{wishlist.map((nft) => (
									<WishlistNFTPreview
										key={nft._id}
										nft={nft}
									/>
								))}
							</DropdownMenu.DropdownMenuGroup>
						)}
						{isLoading && (
							<Button appearance={"surface"}>
								<Spinner />
								Loading...
							</Button>
						)}
						{wishlist?.length === 0 && (
							<Container className="p-2">
								<Button appearance={"action"}>Visit the sweetshop</Button>
							</Container>
						)}
					</DropdownContainer>
				</DropdownContent>
			</DropdownMenu.Portal>
		</DropdownMenu.Root>
	);
}

const WishlistNFTPreview = ({nft}) => {
	const {removeFromWishlist} = useWishlist(nft._id);
	const onRemoveFromWishlist = (e) => {
		console.log({e});
		e.stopPropagation();
		removeFromWishlist();
	};
	return (
		<NavDropdownItem className="flex gap-4 flex-col relative p-2 rounded-xl hover:cursor-pointer w-96 group">
			<Link
				href={`/post/nft/${nft._id}`}
				key={nft._id}
			>
				<a>
					<Container className="flex justify-between relative z-0 gap-4">
						<Container
							css={{
								backgroundColor: "$elementOnSurface",
								background: `url("/api/v3/image/nft/${nft._id}/${
									nft.protected ? "blur" : "thumbnail"
								}")`,
								backgroundSize: "cover",
							}}
							className="w-16 aspect-square rounded-xl"
						/>
						<Container className="flex flex-col flex-1">
							<Text
								className="line-clamp-1"
								css={{color: "$textContrast"}}
							>
								<ImportantText>{nft.name}</ImportantText>
							</Text>
							<Text>{nft.creator.username}</Text>
						</Container>
						<Container className="flex-shrink-0">
							<Text>
								<ImportantText>{nft.price} BNB</ImportantText>
							</Text>
						</Container>
					</Container>
				</a>
			</Link>

			<Container className="flex gap-4">
				<Button
					onClick={onRemoveFromWishlist}
					appearance={"action"}
					css={{
						padding: "4px 8px",
					}}
				>
					<TrashIcon className="w-4 h-4" />
					Remove from wishlist
				</Button>
			</Container>
		</NavDropdownItem>
	);
};
