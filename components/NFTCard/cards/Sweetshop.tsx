import {Container} from "@packages/shared/components/Container";
import {useTritNFTUtils} from "@packages/post/hooks";
import {TritPostProps} from "@packages/post/types";
import {NFTCard} from "..";
import {Button} from "@packages/shared/components/Button";
import {DotsHorizontalIcon} from "@heroicons/react/outline";

export default function SweetshopNFT(props: TritPostProps) {
	const {liked, likeNFT, isMine, isProtected} = useTritNFTUtils(props);

	const soldOut = props.collection?.minted === props.max_supply;
	return (
		<NFTCard _id={props._id}>
			<Container className="relative flex w-full overflow-hidden aspect-square">
				<NFTCard.Media
					isProtected={isProtected && !isMine}
					caption={props.text}
					_id={props._id}
				/>
				<Container
					className="flex flex-col justify-between w-full h-full p-2"
					css={{zIndex: 10}}
				>
					<Container className="flex items-center justify-between">
						<Container>{isProtected && <NFTCard.Protected />}</Container>
						<NFTCard.Creator
							avatar={props.creator.avatar}
							username={props.creator.username}
						/>
					</Container>
				</Container>
			</Container>
			<Container className="flex flex-col w-full gap-2 px-4">
				<NFTCard.MarketStatus market={"creator"} />
				<NFTCard.Detail
					{...props}
					isMine={isMine}
					liked={liked}
					likeNFT={likeNFT}
					unlikeNFT={likeNFT}
					creator={props.creator.username}
					toggleImageProtection={() => null}
					isProtected={isProtected}
					hideSeller={props.hideSeller}
					count={props.count}
					soldOut={soldOut}
					Price={NFTCard.Price}
					ListedBy={NFTCard.ListedBy}
				>
					<NFTCard.Actions>
						<Button
							size={"sm"}
							appearance={"link"}
						>
							<DotsHorizontalIcon className="w-5 h-5" />
						</Button>
					</NFTCard.Actions>
				</NFTCard.Detail>
			</Container>
		</NFTCard>
	);
}
