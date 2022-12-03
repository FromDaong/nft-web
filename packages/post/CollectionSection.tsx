import {ArrowRightIcon} from "@heroicons/react/outline";
import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import {Heading} from "@packages/shared/components/Typography/Headings";
import UserAvatar from "core/auth/components/Avatar";
import {PostMediaContent} from "./PostMediaContent";
import {FrostyBackgroundContainer} from "./TritPost";
import {TPost} from "./types";

const CollectionItem = () => {
	return <Container css={{height: "360px"}}></Container>;
};

export default function TreatOfTheMonthCollectionSection(props: {
	collectionItems: Array<TPost>;
}) {
	return (
		<Container className="grid grid-cols-1 gap-8 lg:grid-cols-2">
			<Container
				className="overflow-hidden rounded-xl drop-shadow bg-gradient-to-r from-purple-500 to-pink-500"
				css={{minHeight: "560px", backgroundColor: "$elementSurface"}}
			></Container>
			<Container
				className="flex flex-col h-auto gap-8 p-8 rounded-xl drop-shadow"
				css={{backgroundColor: "$elementSurface"}}
			>
				<Container css={{height: "360px"}}>
					<Container className="grid grid-cols-1 gap-4 lg:grid-cols-2 ">
						{[1, 2, 3, 4].map((item) => (
							<Container
								key={item}
								className="overflow-hidden rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500"
								css={{height: "180px", backgroundColor: "red"}}
							></Container>
						))}
					</Container>
				</Container>
				<Container className="flex items-center gap-2">
					<UserAvatar
						value={props.collectionItems[0].author.username}
						size={32}
					/>
					<Heading size="sm">
						{props.collectionItems[0].collection.name}
					</Heading>
				</Container>
				<Container className="flex flex-col gap-4 md:flex-row justify-between">
					<Button
						appearance={"surface"}
						className="flex items-center gap-2"
					>
						<span>View TreatDAO magazine</span>
						<ArrowRightIcon
							width={16}
							height={16}
						/>
					</Button>
					<Button
						appearance={"surface"}
						className="flex items-center gap-2"
					>
						<span>View the Ethereum collection</span>
						<ArrowRightIcon
							width={16}
							height={16}
						/>
					</Button>
				</Container>
			</Container>
		</Container>
	);
}
