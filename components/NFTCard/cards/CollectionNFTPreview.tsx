import React from "react";
import {NFTCard} from "..";
import {Container} from "@packages/shared/components/Container";

type CollectionNFTPreviewProps = {
	_id: string;
	creator: {
		username: string;
		avatar: string;
	};
	name: string;
	isProtected: boolean;
	isMine: boolean;
};

export default function CollectionNFTPreview(props: CollectionNFTPreviewProps) {
	return (
		<NFTCard _id={props._id}>
			<NFTCard.RenderMedia
				isProtected={props.isProtected}
				isMine={props.isMine}
				text={props.name}
				_id={props._id}
			/>
			<Container className="flex flex-col w-full gap-2 px-4">
				<NFTCard.Detail
					{...props}
					isMine={props.isMine}
					creator={props.creator.username}
					toggleImageProtection={() => null}
				/>
			</Container>
		</NFTCard>
	);
}
