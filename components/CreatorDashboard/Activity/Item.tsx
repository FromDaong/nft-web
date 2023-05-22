import {ImportantText, Text} from "@packages/shared/components/Typography/Text";
import {timeFromNow} from "@utils/index";
import Link from "next/link";
import {BuyIconBadge, LikeIconBadge} from ".";
import {Container} from "@packages/shared/components/Container";

function TimelineBorder() {
	return (
		<Container
			css={{
				borderColor: "$border",
			}}
			className={"absolute h-full border-l-2 z-0 top-2 left-3 border-dashed"}
		/>
	);
}

type Activity = {
	id: string;
	verb: "like" | "sale";
	actor: {
		username: string;
		display_name: string;
	};
	subject: {
		id: string;
		name: string;
		price?: number;
		href: string;
	};
	timestamp: number;
};

export default function ActivityItem(props: Activity) {
	const verb_phrase =
		props.verb === "like" ? "liked your NFT" : "bought your NFT";

	return (
		<Container className={"flex relative items-start gap-4"}>
			<Container className={"flex py-2"}>
				{props.verb === "like" && <LikeIconBadge />}
				{props.verb === "sale" && <BuyIconBadge />}
				<TimelineBorder />
			</Container>
			<Container className={"py-2 flex flex-col gap-1"}>
				<Text className="line-clamp-1">
					<Link href={""}>
						<a>
							<ImportantText contrast>{props.actor.display_name}</ImportantText>
						</a>
					</Link>{" "}
					{verb_phrase}{" "}
					<Link href={""}>
						<a>
							<ImportantText contrast>{props.subject.name}</ImportantText>
						</a>
					</Link>
				</Text>
				<p>
					<Text>{timeFromNow(new Date(props.timestamp).toISOString())}</Text>{" "}
					{props.subject.price && (
						<>
							&bull; <Text>0.001 BNB</Text>
						</>
					)}
				</p>
			</Container>
		</Container>
	);
}
