import BackgroundImage from "./BackgroundImage";

export const PostMediaContent = (props: {
	imageUrl?: string;
	blurhash?: string;
	overrideText?: string;
	caption: string;
	isProtected?: boolean;
}) => {
	return (
		<BackgroundImage
			url={props.imageUrl}
			caption={props.caption}
		/>
	);
};
