import {Container} from "@packages/shared/components/Container";
import {useTritNFTUtils} from "@packages/post/hooks";
import {TritPostProps} from "@packages/post/types";
import {NFTCard} from "..";
import {Heading} from "@packages/shared/components/Typography/Headings";
import {Button} from "@packages/shared/components/Button";
import {EnterFullScreenIcon} from "@radix-ui/react-icons";

export default function PortfolioPublicListingCard(props: TritPostProps) {
	const {liked, likeNFT, isMine, isProtected} = useTritNFTUtils(props);

	const soldOut = props.collection?.minted === props.max_supply;
	const editions = new Array(+props.count).fill(0).map((_, i) => i + 1);
	console.log(editions);
	return (
		<NFTCard _id={props._id}>
			<Container className="relative">
				<Container
					className="relative shadow cursor-pointer rounded-xl overflow-clip group"
					css={{zIndex: 4}}
				>
					<NFTCard.RenderMedia
						isProtected={isProtected}
						isMine={isMine}
						text={props.text}
						_id={props._id}
					/>
					<Container
						className="absolute top-0 left-0 flex-col items-center justify-end hidden w-full h-full gap-4 p-4 pb-8 text-center transition-opacity duration-300 group-hover:flex"
						css={{
							zIndex: 10,
							background:
								"linear-gradient(180deg, rgba(0, 0, 0, 0.04) 0%, rgba(0, 0, 0, 0.525208) 57.08%, rgba(0, 0, 0, 0.85) 100%)",
						}}
					>
						<Heading
							css={{color: "$white"}}
							size={"xs"}
						>
							{props.name}
						</Heading>
						<Button
							className="w-fit"
							appearance={"surface"}
							css={{borderRadius: 999}}
						>
							<EnterFullScreenIcon className="w-4 h-4" />
							View in fullscreen
						</Button>
					</Container>
				</Container>
				{editions.slice(0, 3).map((_, i) => (
					<Container
						key={i}
						className="absolute top-0 right-0 border shadow rounded-xl"
						css={{
							width: `${100 - (i + 1) * 10}%`,
							height: "100%",
							top: `${(i + 1) * 1.5}%`,
							borderColor: "$border",
							left: "50%",
							transform: "translateX(-50%)",
							zIndex: 3 - i,
							backgroundColor: "$surface",
						}}
					/>
				))}
			</Container>
		</NFTCard>
	);
}
