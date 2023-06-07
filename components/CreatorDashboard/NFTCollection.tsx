import AvatarGroup from "@packages/avatars/AvatarGroup";
import {Container} from "@packages/shared/components/Container";
import {Heading, Text} from "@packages/shared/components/Typography/Headings";
import {Verified} from "lucide-react";
import Link from "next/link";

function NFTCollection({item}) {
	return (
		<Link
			href={`${item.href}`}
			key={item.href}
		>
			<a>
				<Container
					className="p-4 transition-all duration-200 ease-in-out rounded-xl"
					css={{
						"&:hover": {
							backgroundColor: "$surfaceOnSurface",
						},
					}}
				>
					<Container
						className="relative w-full col-span-1 overflow-hidden rounded-xl aspect-[16/9]"
						key={item.name}
						css={{
							background: `url("${item.cover_image ?? "/assets/bg.jpg"}")`,
							backgroundSize: "cover",
						}}
					></Container>
				</Container>
				<Container className="flex items-start gap-2 py-4">
					<AvatarGroup
						users={[
							{
								href: `/${item.creator.username}`,
								imageUrl: item.creator.avatar,
								name: item.creator.username,
								size: 32,
							},
						]}
					/>
					<Container className={"flex flex-col"}>
						<Heading size={"xss"}>{item.name}</Heading>
						<Container className="flex items-center w-full gap-1">
							<Verified className="w-4 h-4" />
							<Text>{item.creator.username}</Text>
						</Container>
						<Text>
							{item.nfts?.length} nft{item.nfts?.length > 1 ? "s" : ""}
						</Text>
					</Container>
				</Container>
			</a>
		</Link>
	);
}

export default NFTCollection;
