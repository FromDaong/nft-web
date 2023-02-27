import BackgroundImage from "./BackgroundImage";

export const PostMediaContent = (props: {
	blurhash?: string;
	overrideText?: string;
	caption: string;
	isProtected?: boolean;
	ipfs: string;
	_id: string;
}) => {
	return (
		<BackgroundImage
			ipfs={props.ipfs}
			url={`/api/v3/image/nft/${props._id}/sd`}
			caption={props.caption}
			isProtected={props.isProtected}
		/>
	);
};
