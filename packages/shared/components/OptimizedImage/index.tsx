import Image from "next/future/image";

const gumletLoader = ({src, width, quality}) => {
	return `https://treatnfts.gumlet.io${src}w=${width}&q=${
		quality || 75
	}&format=auto`;
};

type OptimizedImageProps = {
	src?: string;
	alt: string;
	width?: number;
	height?: number;
	quality?: number;
	className?: string;
	fill?: boolean;
	objectFit?: "contain" | "cover" | "fill";
	sizes?: string;
	layout?: string;
};

const OptimizedImage = (props: OptimizedImageProps) => {
	return (
		<Image
			loader={gumletLoader}
			quality={props.quality}
			src={`/api/v3/media/${props.src}`}
			alt={props.alt}
			width={props.height}
			height={props.height}
			className={props.className}
			fill={props.fill}
			sizes={props.sizes}
			style={{objectFit: props.objectFit}}
			loading={"lazy"}
		/>
	);
};

export default OptimizedImage;
