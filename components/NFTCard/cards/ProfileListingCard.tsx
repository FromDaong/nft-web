import {Container} from "@packages/shared/components/Container";
import {useTritNFTUtils} from "@packages/post/hooks";
import {TritPostProps} from "@packages/post/types";
import {NFTCard} from "..";

export default function CreatorProfileNFT(props: TritPostProps) {
	const {liked, likeNFT, isMine, isProtected} = useTritNFTUtils(props);

	const soldOut = props.collection?.minted === props.max_supply;
	return (
		<NFTCard _id={props._id}>
			<NFTCard.RenderMedia
				isProtected={isProtected}
				isMine={isMine}
				text={props.text}
				_id={props._id}
			/>
			<Container className="flex flex-col w-full gap-2">
				<NFTCard.Detail
					{...props}
					isMine={isMine}
					creator={props.creator.username}
					toggleImageProtection={() => null}
					isProtected={isProtected}
					hideSeller={props.hideSeller}
					count={props.count}
					Price={NFTCard.Price}
				/>
				{soldOut && <NFTCard.SoldOut />}
			</Container>
		</NFTCard>
	);
}
