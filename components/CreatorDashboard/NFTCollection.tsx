import AvatarGroup from "@packages/avatars/AvatarGroup";
import {Container} from "@packages/shared/components/Container";
import {Heading, Text} from "@packages/shared/components/Typography/Headings";
import {Verified} from "lucide-react";
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
				<Container className="flex gap-2 py-4 items-start">
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
					<Container className={"flex flex-col"}>
						<Heading size={"xss"}>{item.name}</Heading>
						<Container className="w-full flex items-center gap-1">
							<Verified className="w-4 h-4" />
							<Text>{item.creator.username}</Text>
						</Container>
						<Text>{item.nfts?.length} </Text>
					</Container>
				</Container>
			</a>
		</Link>
	);
}

export default NFTCollection;
