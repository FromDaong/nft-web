import {Heading, Text} from "@packages/shared/components/Typography/Headings";
import {Container} from "@packages/shared/components/Container";
import {
	ImportantText,
	MutedText,
	SmallText,
} from "@packages/shared/components/Typography/Text";
import Link from "next/link";
import UserAvatar from "core/auth/components/Avatar";
import {UserGroupIcon} from "@heroicons/react/outline";
import {
	CalendarDaysIcon,
	CircleSlashIcon,
	VeganIcon,
	Verified,
} from "lucide-react";

export const ActionSection = (props) => {
	return (
		<Container className="w-full gap-2">
			<Container className="flex flex-col gap-4">
				<Container className="flex flex-wrap gap-4">
					{false && <SecondaryListingTag />}
					{false && <TreatOfTheMonthTag />}
					{false && <MelonTag />}
					{props.soldOut && <SoldOutTag />}
					{false && <VerifiedTag />}
				</Container>

				<Container className="flex flex-col w-full gap-1">
					<Heading
						size={"xss"}
						className="line-clamp-1"
						css={{padding: 0}}
					>
						{props.name}
					</Heading>
					<Container className="flex gap-2">
						<Container className={"flex gap-2 items-center"}>
							<img
								src={props.author?.avatar}
								className="w-5 h-5 rounded-full"
							/>
							<Text>Listed by @{props.author?.username}</Text>
						</Container>
					</Container>
					{!props.noPrice && (
						<Container className="flex items-baseline gap-1 mt-2">
							{!props.melon_nft && (
								<>
									<Heading size={"xss"}>
										{props.price.value ?? "0.0"} {props.price.currency}
									</Heading>
									{props.soldOut && (
										<>
											<MutedText>&bull;</MutedText>
											<Text css={{color: "$red11"}}>Sold out</Text>
										</>
									)}
								</>
							)}
						</Container>
					)}
				</Container>
			</Container>
		</Container>
	);
};

export const UserBadge = (props: {username: string; avatar: string}) => {
	return (
		<Link href={`/${props.username}`}>
			<a>
				<Container className="flex gap-2 pr-4 rounded-full ">
					<UserAvatar
						size={24}
						username={props.username}
					/>
					<Text>
						<ImportantText>@{props.username}</ImportantText>
					</Text>
				</Container>
			</a>
		</Link>
	);
};

function TreatOfTheMonthTag() {
	return (
		<Container
			className="flex items-center gap-2 p-1 px-2 border rounded-lg w-fit"
			css={{
				backgroundColor: "$purple2",
				borderColor: "$purple6",
			}}
		>
			<Text
				css={{
					color: "$purple11",
				}}
			>
				<CalendarDaysIcon className="w-4 h-4" />
			</Text>
			<Container className="flex gap-2">
				<SmallText
					css={{
						color: "$purple11",
					}}
				>
					<ImportantText>Treat of The Month</ImportantText>
				</SmallText>
			</Container>
		</Container>
	);
}

function MelonTag() {
	return (
		<Container
			className="flex items-center gap-2 p-1 px-2 border rounded-lg w-fit"
			css={{
				backgroundColor: "$mint2",
				borderColor: "$mint6",
			}}
		>
			<Text
				css={{
					color: "$mint11",
				}}
			>
				<VeganIcon className="w-4 h-4" />
			</Text>
			<Container className="flex gap-2">
				<SmallText
					css={{
						color: "$mint11",
					}}
				>
					<ImportantText>Melon</ImportantText>
				</SmallText>
			</Container>
		</Container>
	);
}

function SecondaryListingTag() {
	return (
		<Container
			className="flex items-center gap-2 p-1 px-2 border rounded-lg w-fit"
			css={{
				backgroundColor: "$amber2",
				borderColor: "$amber6",
			}}
		>
			<Text
				css={{
					color: "$amber11",
				}}
			>
				<UserGroupIcon className="w-4 h-4" />
			</Text>
			<Container className="flex gap-2">
				<SmallText
					css={{
						color: "$amber11",
					}}
				>
					<ImportantText>Secondary Listing</ImportantText>
				</SmallText>
			</Container>
		</Container>
	);
}

function SoldOutTag() {
	return (
		<Container
			className="flex items-center gap-2 p-1 px-2 border rounded-lg w-fit"
			css={{
				backgroundColor: "$red1",
				borderColor: "$red5",
			}}
		>
			<Text
				css={{
					color: "$red11",
				}}
			>
				<CircleSlashIcon className="w-4 h-4" />
			</Text>
			<Container className="flex gap-2">
				<SmallText
					css={{
						color: "$red11",
					}}
				>
					<ImportantText>Sold out</ImportantText>
				</SmallText>
			</Container>
		</Container>
	);
}

function VerifiedTag() {
	return (
		<Container
			className="flex items-center gap-2 p-1 px-2 border rounded-lg w-fit"
			css={{
				borderColor: "$pink6",
			}}
		>
			<Text
				css={{
					color: "$pink5",
				}}
			>
				<Verified className="w-4 h-4" />
			</Text>
			<Container className="flex gap-2">
				<SmallText
					css={{
						color: "$pink5",
					}}
				>
					<ImportantText>Verified Creator</ImportantText>
				</SmallText>
			</Container>
		</Container>
	);
}
