import {Heading, Text} from "@packages/shared/components/Typography/Headings";
import {Container} from "@packages/shared/components/Container";
import {
	ImportantText,
	SmallText,
} from "@packages/shared/components/Typography/Text";
import {DotsHorizontalIcon, HeartIcon} from "@heroicons/react/outline";
import {Button} from "@packages/shared/components/Button";
import {HeartFilledIcon} from "@radix-ui/react-icons";
import RectangleStack from "@packages/shared/icons/RectangleStack";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {DropdownMenuItem} from "@packages/Dropdowns";
import {useCopyToClipboard} from "@packages/shared/hooks";
import {useRouter} from "next/router";
import Link from "next/link";
import UserAvatar from "core/auth/components/Avatar";

export const ActionSection = (props) => {
	return (
		<Container className="flex flex-col gap-2 px-2">
			<ImportantText className="px-2">
				<SmallText>Liked by {props.likedBy?.length} people</SmallText>
			</ImportantText>
			<Container className="px-2">
				<Text className="line-clamp-1 text-xl">{props.name}</Text>
				{!props.noPrice && (
					<Container className="rounded-full pb-2">
						<Heading size={"xss"}>
							Selling for {props.price.value} {props.price.currency}
						</Heading>
					</Container>
				)}
			</Container>
			<Container className="flex gap-2 px-2">
				<ActionBar
					liked={props.liked}
					likeNFT={props.likeNFT}
					_id={props._id}
					creator={props.creator}
					toggleImageProtection={props.toggleImageProtection}
					isMine={props.isMine}
					isProtected={props.isProtected}
				/>
			</Container>
		</Container>
	);
};

export const ActionBar = (props) => {
	const router = useRouter();
	const gotoNFT = () => {
		router.push(`/post/nft/${props._id}`);
	};

	return (
		<Container
			className="w-full grid grid-cols-3 "
			css={{backgroundColor: "$surfaceOnSurface", borderRadius: "8px"}}
		>
			<Button
				className="col-span-1 p-3 "
				appearance={"unstyled"}
				onClick={props.likeNFT}
				css={{
					borderRadius: "8px",
					padding: "8px",
					borderColor: "$subtleBorder",
					"&:hover": {backgroundColor: "$elementOnSurface"},
				}}
			>
				{props.liked ? (
					<Text css={{color: "$accentText"}}>
						<HeartFilledIcon
							width={20}
							height={20}
						/>
					</Text>
				) : (
					<HeartIcon
						width={20}
						height={20}
					/>
				)}
				<span>Like</span>
			</Button>
			<Button
				className="col-span-1 p-3 "
				appearance={"unstyled"}
				css={{
					borderRadius: "8px",
					padding: "8px",
					borderColor: "$subtleBorder",
					"&:hover": {backgroundColor: "$elementOnSurface"},
					color: props.isMine ? "$accentText" : "inherit",
				}}
				onClick={gotoNFT}
			>
				<RectangleStack
					height={20}
					width={20}
				/>
				<span>{props.isMine ? "Owned" : "View"}</span>
			</Button>
			<MoreActionsDropdown
				creator={props.creator}
				id={props._id}
				toggleImageProtection={props.toggleImageProtection}
				isMine={props.isMine}
				isProtected={props.isProtected}
			/>
		</Container>
	);
};

export const MoreActionsDropdown = (props) => {
	const [, copy] = useCopyToClipboard();
	const router = useRouter();

	const copyToClipboard = () => {
		copy(window.origin + "/post/nft/" + props.id);
	};

	const gotoCreator = () => {
		router.push(`/${props.creator}`);
	};

	return (
		<DropdownMenu.Root>
			<DropdownMenu.Trigger className="col-span-1 w-full grid">
				<Button
					className="col-span-1 p-3 "
					appearance={"unstyled"}
					css={{
						borderRadius: "8px",
						padding: "8px",
						borderColor: "$subtleBorder",
						"&:hover": {backgroundColor: "$elementOnSurface"},
					}}
				>
					<DotsHorizontalIcon
						width={20}
						height={20}
					/>
					<span>More</span>
				</Button>
			</DropdownMenu.Trigger>
			<DropdownMenu.Portal>
				<DropdownMenu.Content className="z-30 p-3 shadow-xl gap-y-3 rounded-xl bg-white">
					<DropdownMenuItem
						onClick={copyToClipboard}
						className="px-4 py-2 flex gap-2"
					>
						<Text>🌍</Text>
						<Text>
							<ImportantText>Get NFT link</ImportantText>
						</Text>
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={gotoCreator}
						className="px-4 py-2 flex gap-2"
					>
						<Text>🎨</Text>
						<Text>
							<ImportantText>Go to creator</ImportantText>
						</Text>
					</DropdownMenuItem>
					{props.isMine && (
						<DropdownMenuItem
							onClick={props.toggleImageProtection}
							className="px-4 py-2 flex gap-2"
						>
							<Text>👀</Text>
							<Text>
								<ImportantText>
									{props.isProtected ? "Show HD version" : "Hide HD media"}
								</ImportantText>
							</Text>
						</DropdownMenuItem>
					)}
				</DropdownMenu.Content>
			</DropdownMenu.Portal>
		</DropdownMenu.Root>
	);
};

export const UserBadge = (props: {username: string; avatar: string}) => {
	return (
		<Link href={`/${props.username}`}>
			<a>
				<Container className="flex gap-2 pr-4 rounded-full ">
					<UserAvatar
						size={24}
						value={props.username}
					/>
					<Text>
						<ImportantText>@{props.username}</ImportantText>
					</Text>
				</Container>
			</a>
		</Link>
	);
};
