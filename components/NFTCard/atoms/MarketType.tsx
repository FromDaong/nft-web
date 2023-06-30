import {UserGroupIcon} from "@heroicons/react/outline";
import {Container} from "@packages/shared/components/Container";
import {
	ImportantText,
	SmallText,
	Text,
} from "@packages/shared/components/Typography/Text";
import {CircleSlashIcon, VeganIcon} from "lucide-react";
import {CalendarDaysIcon, Verified} from "lucide-react";

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

export function SoldOutTag() {
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

export default function MarketType(props: {
	market: "creator" | "resale" | "totm" | "melon";
}) {
	return (
		<Container className="flex flex-wrap gap-4">
			{props.market === "resale" && <SecondaryListingTag />}
			{props.market === "totm" && <TreatOfTheMonthTag />}
			{props.market === "melon" && <MelonTag />}
			{props.market === "creator" && <VerifiedTag />}
		</Container>
	);
}
