import {Heading, Text} from "@packages/shared/components/Typography/Headings";
import {Container} from "@packages/shared/components/Container";
import {
	ImportantText,
	MutedText,
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
import {styled} from "@stitches/react";

export const ActionSection = (props) => {
	return (
		<Container className="grid grid-cols-5 gap-2">
			<Container className="col-span-4 flex flex-col gap-4">
				<Container className="flex flex-col w-full">
					<Text
						className="line-clamp-1"
						css={{padding: 0}}
					>
						<ImportantText>{props.name}</ImportantText>
					</Text>
					<MutedText css={{lineHeight: "12px"}}>Listed by creator</MutedText>
				</Container>

				{!props.noPrice && (
					<Container className="flex items-baseline gap-1">
						<Heading size={"xss"}>
							{props.price.value} {props.price.currency}
						</Heading>
						<MutedText>asking price</MutedText>
					</Container>
				)}
			</Container>
			<Container className="flex justify-end">
				<MoreActionsDropdown
					creator={props.creator}
					id={props._id}
					toggleImageProtection={props.toggleImageProtection}
					isMine={props.isMine}
					isProtected={props.isProtected}
				/>
			</Container>
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
			<DropdownMenu.Trigger className="w-full flex justify-end">
				<Container
					className="col-span-1 p-3 rounded-full hover:bg-gray-100"
					css={{
						borderRadius: "9999px",
						padding: "4px",
					}}
				>
					<DotsHorizontalIcon
						width={24}
						height={24}
					/>
				</Container>
			</DropdownMenu.Trigger>
			<DropdownMenu.Portal>
				<DropdownMenu.Content className="z-30 p-3 shadow-xl gap-y-3 rounded-xl bg-white transition-all duration-150">
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
