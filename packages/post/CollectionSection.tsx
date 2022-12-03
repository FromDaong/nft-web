import {ArrowRightIcon} from "@heroicons/react/outline";
import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import {Heading} from "@packages/shared/components/Typography/Headings";
import UserAvatar from "core/auth/components/Avatar";
import {FrostyBackgroundContainer} from "./TritPost";
import {TPost} from "./types";

const CollectionItem = () => {
	return <Container css={{height: "360px"}}></Container>;
};

export default function TreatOfTheMonthCollectionSection(props: {
	collectionItems: Array<TPost>;
}) {
	return (
		<Container className="grid grid-cols-1 lg:grid-cols-2 gap-8">
			<Container
				className="rounded-xl drop-shadow"
				css={{minHeight: "560px", backgroundColor: "$elementSurface"}}
			></Container>
			<Container
				className="rounded-xl drop-shadow h-auto p-8 flex flex-col gap-8"
				css={{backgroundColor: "$elementSurface"}}
			>
				<Container className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
					{props.collectionItems.map((item) => (
						<CollectionItem key={item.id} />
					))}
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
				<Container className="flex justify-between">
					<Button
						appearance={"surface"}
						className="flex gap-2 items-center"
					>
						<span>View TreatDAO magazine</span>
						<ArrowRightIcon
							width={16}
							height={16}
						/>
					</Button>
					<Button
						appearance={"surface"}
						className="flex gap-2 items-center"
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
