import {Container} from "@packages/shared/components/Container";
import {useTritNFTUtils} from "@packages/post/hooks";
import {TritPostProps} from "@packages/post/types";
import {NFTCard} from "..";
import Link from "next/link";

export default function CreatorProfileNFT(props: TritPostProps) {
	const {isMine, isProtected} = useTritNFTUtils(props);

	return (
		<Link href={`/post/nft/${props._id}`}>
			<a>
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
						/>
					</Container>
				</NFTCard>
			</a>
		</Link>
	);
}
