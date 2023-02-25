import BackgroundImage from "./BackgroundImage";

export const PostMediaContent = (props: {
	imageUrl?: string;
	blurhash?: string;
	overrideText?: string;
	caption: string;
	isProtected?: boolean;
	ipfs: string;
	id: string;
}) => {
	return (
		<BackgroundImage
			ipfs={props.ipfs}
			url={props.imageUrl}
			caption={props.caption}
			isProtected={props.isProtected}
			id={props.id}
		/>
	);
};
