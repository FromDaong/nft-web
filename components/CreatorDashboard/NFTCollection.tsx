import {NFTCard} from "@components/NFTCard";
import {FrostyBackgroundContainer} from "@components/NFTCard/misc/FrostyBackground";
import AvatarGroup from "@packages/avatars/AvatarGroup";
import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import {Heading, Text} from "@packages/shared/components/Typography/Headings";
import {StackIcon} from "@radix-ui/react-icons";
import {ArrowRight} from "lucide-react";
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
					className="relative w-full col-span-1 overflow-hidden rounded-xl aspect-[16/9] flex flex-col justify-end gap-8 p-4"
					key={item.name}
					css={{
						background: `linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #000000 100%), url("${
							item.cover_image ?? "/assets/bg.jpg"
						}")`,
						backgroundSize: "cover",
					}}
				>
					<Container className="flex flex-col items-start gap-2">
						<Heading
							size={"sm"}
							css={{color: "$white"}}
						>
							{item.name}
						</Heading>
						<NFTCard.Creator
							avatar={item.creator.avatar}
							username={item.creator.username}
						/>
					</Container>
					<Container className="flex justify-between items-center">
						<FrostyBackgroundContainer
							as={Button}
							appearance={"invert"}
							css={{
								color: "$textContrast",
							}}
							className="shadow-xl"
						>
							View collection <ArrowRight className="w-4 h-4" />
						</FrostyBackgroundContainer>
						<FrostyBackgroundContainer className="rounded-full p-2 px-4 flex gap-2 font-semibold items-center">
							<StackIcon className="w-5 h-5" />
							{item.nfts?.length} nft{item.nfts?.length > 1 ? "s" : ""}
						</FrostyBackgroundContainer>
					</Container>
				</Container>
			</a>
		</Link>
	);
}

export default NFTCollection;
