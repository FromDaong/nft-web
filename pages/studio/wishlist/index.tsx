import StudioNavigation from "@components/CreatorDashboard/StudioNavigation";
import {DotsVerticalIcon, StarIcon, XIcon} from "@heroicons/react/outline";
import {useMyWishlist, useWishlist} from "@packages/chain/hooks/useWishlist";
import {NavDropdownItem} from "@packages/navigation/components/DropdownContainer";
import {TritPostProps} from "@packages/post/types";
import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import {Heading} from "@packages/shared/components/Typography/Headings";
import {
	ImportantText,
	SmallText,
	Text,
} from "@packages/shared/components/Typography/Text";
import CoinsIcon from "@packages/shared/icons/CoinsIcon";
import Spinner from "@packages/shared/icons/Spinner";
import ApplicationFrame from "core/components/layouts/ApplicationFrame";
import ApplicationLayout from "core/components/layouts/ApplicationLayout";
import {ArrowRight, MinusCircleIcon} from "lucide-react";
import Link from "next/link";
import {useAccount} from "wagmi";

export default function WishlistPage() {
	const {address} = useAccount();
	const {isLoading, wishlist} = useMyWishlist(address);

	return (
		<ApplicationLayout>
			{isLoading && (
				<Container className="flex items-center justify-center w-full h-full">
					<Spinner />
				</Container>
			)}
			{wishlist?.length > 0 && (
				<ApplicationFrame>
					<Container
						css={{borderColor: "$border"}}
						className="flex flex-col justify-between gap-2 my-8"
					>
						<Heading>Wishlist</Heading>
						<Text css={{fontSize: "large"}}>
							Your wishlist is a collection of NFTs you want to buy in the
							future.
						</Text>
					</Container>
					{!isLoading && wishlist?.length !== 0 && (
						<Container className="grid grid-cols-1 gap-8 p-1 my-2 md:grid-cols-2 lg:grid-cols-3 xl:grd-cols-4 ">
							{wishlist.map((nft) => (
								<WishlistNFTCard
									key={nft._id}
									nft={nft}
								/>
							))}
						</Container>
					)}
					{isLoading && (
						<Button appearance={"surface"}>
							<Spinner />
							Loading...
						</Button>
					)}
				</ApplicationFrame>
			)}
			{wishlist.length === 0 && (
				<ApplicationFrame>
					<Container className="flex items-center justify-center w-full h-full py-24 min-h-[480px]">
						<Container className="flex flex-col items-center justify-center gap-4">
							<Heading>Empty wishlist</Heading>
							<Text css={{fontSize: "large"}}>
								NFTs you add to your wishlist will appear here.
							</Text>
							<Container className="p-2 mt-4">
								<Link href={"/sweetshop"}>
									<a>
										<Button
											appearance={"action"}
											css={{padding: "1rem"}}
										>
											Find NFTs on the sweetshop
											<ArrowRight className="w-5 h-5" />
										</Button>
									</a>
								</Link>
							</Container>
						</Container>
					</Container>
				</ApplicationFrame>
			)}
		</ApplicationLayout>
	);
}

export function WishlistNFTCard({nft}) {
	const {removeFromWishlist} = useWishlist(nft._id);
	const onRemoveFromWishlist = (e) => {
		e.stopPropagation();
		removeFromWishlist();
	};

	return (
		<Container
			className="flex flex-col gap-4 p-4 rounded-xl"
			css={{backgroundColor: "$surfaceOnSurface"}}
		>
			<Container
				css={{
					backgroundColor: "$elementOnSurface",
					background: `url("/api/v3/image/nft/${nft._id}/${
						nft.protected ? "blur" : "thumbnail"
					}")`,
					backgroundSize: "cover",
				}}
				className="w-full h-96 rounded-xl aspect-[11/16]"
			/>
			<Container className="flex flex-col gap-1">
				<Container className="flex justify-between gap-4">
					<Heading
						size={"xss"}
						className="flex-1"
					>
						{nft.name}
					</Heading>
				</Container>
				<Container className="flex gap-2">
					<Text>
						<ImportantText>@{nft.creator.username}</ImportantText>
					</Text>
					<Text>&bull;</Text>
					<Text className="uppercase">
						<ImportantText>{nft.price} BNB</ImportantText>
					</Text>
				</Container>
				<Container className="flex justify-between gap-4 mt-4">
					<Button
						size={"sm"}
						appearance={"danger"}
						onClick={onRemoveFromWishlist}
					>
						<XIcon className="w-5 h-5" />
						Remove
					</Button>
					<Link href={`/post/nft/${nft._id}`}>
						<a>
							<Button
								size={"sm"}
								appearance={"surface"}
								outlined
							>
								View on sweetshop <ArrowRight className="w-5 h-5" />
							</Button>
						</a>
					</Link>
				</Container>
			</Container>
		</Container>
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
		<Container className="relative flex flex-col gap-4 p-2 rounded-xl hover:cursor-pointer w-96 group">
			<Link
				href={`/post/nft/${nft._id}`}
				key={nft._id}
			>
				<a>
					<Container className="relative z-0 flex justify-between gap-4">
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
					appearance={"danger"}
					css={{
						padding: "4px 8px",
					}}
				>
					<MinusCircleIcon className="w-4 h-4" />
					Remove
				</Button>
			</Container>
		</Container>
	);
};
