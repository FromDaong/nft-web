import AvatarGroup from "@packages/avatars/AvatarGroup";
import {Container} from "@packages/shared/components/Container";
import {Heading, Text} from "@packages/shared/components/Typography/Headings";
import Link from "next/link";

function NFTCollection({item}) {
	return (
		<Link
			href={`/studio/collections/${item.href}`}
			key={item.href}
		>
			<a>
				<Container
					className="rounded-xl relative col-span-1 overflow-hidden w-full aspect-video"
					key={item.name}
					css={{
						background: `url("${item.cover_image}")`,
						backgroundSize: "cover",
					}}
				></Container>
				<Container className={"py-4 flex flex-col"}>
					<Heading size={"xss"}>{item.name}</Heading>
					<Container className="w-full flex items-center gap-2">
						<Text>Created by </Text>
						<AvatarGroup
							users={[
								{
									href: `/${item.creator.username}`,
									imageUrl: item.creator.avatar,
									name: item.creator.username,
									size: 24,
								},
							]}
						/>
					</Container>
				</Container>
			</a>
		</Link>
	);
}

export default NFTCollection;
