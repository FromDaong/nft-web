import {ArrowRightIcon} from "@heroicons/react/outline";
import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import {Heading} from "@packages/shared/components/Typography/Headings";
import UserAvatar from "core/auth/components/Avatar";
import Link from "next/link";
import {TPost} from "./types";

export default function TreatOfTheMonthCollectionSection(props: {
	collectionItems: Array<TPost>;
	title: string;
	author: Array<{
		username: string;
		display_name: string;
	}>;
}) {
	return (
		<Container className="grid grid-cols-1 gap-8 lg:grid-cols-2">
			<Container
				css={{
					minHeight: "420px",
					height: "auto",
					backgroundColor: "$elementSurface",
					borderColor: "$accentBorder",
				}}
				className="flex flex-col overflow-hidden border-2 rounded-xl drop-shadow"
			>
				<Container
					className="flex-1"
					css={{
						backgroundImage: `url('https://treatnfts.gumlet.io/api/v3/image?default=${
							props.collectionItems[0]?.image.cdn ??
							props.collectionItems[0]?.image.ipfs
						}')`,
						backgroundSize: "cover",
						backgroundPosition: "center",
					}}
				/>
				<Container className="p-4">
					<Heading size="sm">{props.collectionItems[0]?.name}</Heading>
				</Container>
			</Container>
			<Container
				className="flex flex-col h-auto gap-8 p-8 border-2 rounded-xl drop-shadow"
				css={{
					backgroundColor: "$elementSurface",
					borderColor: "$accentBorder",
				}}
			>
				<Container className="grid grid-cols-1 gap-8 lg:grid-cols-2 ">
					{props.collectionItems.slice(2, 6).map((item) => (
						<Container
							key={item.id}
							className="overflow-hidden rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500"
							css={{
								height: "180px",
								backgroundImage: `url('https://treatnfts.gumlet.io/api/v3/image?default=${
									item.image.cdn ?? item.image.ipfs
								}')`,
								backgroundSize: "cover",
								backgroundPosition: "center",
							}}
						></Container>
					))}
				</Container>
				<Container className="flex items-center gap-2">
					<Container className="flex">
						<Link href={`/${props.author[0]?.username}`}>
							<a>
								<UserAvatar
									value={props.author[0]?.username}
									size={32}
								/>
							</a>
						</Link>
						{props.author.slice(1, props.author.length).map((author) => (
							<Container
								key={author.username}
								css={{marginLeft: "-16px"}}
							>
								<Link href={`/${author.username}`}>
									<a>
										<UserAvatar
											value={author.username}
											size={32}
										/>
									</a>
								</Link>
							</Container>
						))}
					</Container>
					<Heading size="sm">{props.title}</Heading>
				</Container>
				<Container className="flex flex-col justify-between gap-4 md:flex-row">
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
						css={{backgroundColor: "$accentText"}}
						className="flex items-center gap-2"
					>
						<span>Take me to the collection</span>
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
