import React from "react";
import {NFTCard} from "..";
import {Container} from "@packages/shared/components/Container";
import Link from "next/link";
import {TritPostProps} from "@packages/post/types";

export default function CollectionNFTPreview(
	props: TritPostProps & {
		isProtected: boolean;
	}
) {
	console.log({props});
	return (
		<Link
			href={`/post/nft/${props._id}?seller=${props.seller}&id=${props.id}&market=verified`}
		>
			<a>
				<NFTCard _id={props._id}>
					<NFTCard.RenderMedia
						isProtected={props.isProtected}
						isMine={props.isMine}
						text={props.name}
						_id={props._id}
					/>
					<Container className="flex flex-col w-full gap-2">
						<NFTCard.Detail
							{...props}
							isMine={props.isMine}
							creator={props.creator.username}
							toggleImageProtection={() => null}
							Price={NFTCard.Price}
						/>
					</Container>
				</NFTCard>
			</a>
		</Link>
	);
}
