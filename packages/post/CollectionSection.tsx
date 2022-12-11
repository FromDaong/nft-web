/* eslint-disable no-mixed-spaces-and-tabs */
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
	const totmItems = !props.collectionItems
		? props.collectionItems.slice(2, 6)
		: new Array(4).fill(0);
	const featuredCreatorItems = !props.collectionItems
		? props.author.slice(1, props.author.length)
		: new Array(4).fill(0);

	return (
		<Container className="grid grid-cols-1 gap-8 lg:grid-cols-2">
			<Container
				className="flex flex-col h-auto gap-4 p-4 border-2 rounded-xl drop-shadow"
				css={{
					backgroundColor: "$elementSurface",
					borderColor: "$accentBorder",
				}}
			>
				<Container className="grid grid-cols-1 gap-4 lg:grid-cols-2 ">
					{totmItems.map((item) => (
						<Container
							key={item.id}
							className="overflow-hidden"
							css={{
								height: "220px",
								background: item.image
									? `url('https://treatnfts.gumlet.io/api/v3/image?default=${
											item.image.cdn ?? item.image.ipfs
									  }')`
									: "$surfaceOnSurface",
								backgroundSize: "cover",
								backgroundPosition: "center",
								borderRadius: "16px",
							}}
						/>
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
						{featuredCreatorItems.map((author) => (
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
			</Container>
			<Container
				className="flex flex-col h-auto gap-4 p-4 rounded-xl drop-shadow"
				css={{
					backgroundColor: "$elementSurface",
					borderColor: "$accentBorder",
				}}
			>
				<Container className="grid grid-cols-1 gap-8 lg:grid-cols-2 ">
					{props.collectionItems.slice(4, 8).map((item) => (
						<Container
							key={item.id}
							className="overflow-hidden"
							css={{
								height: "220px",
								background: item.image
									? `url('https://treatnfts.gumlet.io/api/v3/image?default=${
											item.image.cdn ?? item.image.ipfs
									  }')`
									: "$surfaceOnSurface",
								backgroundSize: "cover",
								backgroundPosition: "center",
								borderRadius: "16px",
							}}
						/>
					))}
				</Container>
				<Container className="flex items-center gap-2">
					<Container className="flex">
						<Link href={`/devan`}>
							<a>
								<UserAvatar
									value={"devan"}
									size={32}
								/>
							</a>
						</Link>
					</Container>
					<Heading size="sm">Featured Creator</Heading>
				</Container>
			</Container>
		</Container>
	);
}
