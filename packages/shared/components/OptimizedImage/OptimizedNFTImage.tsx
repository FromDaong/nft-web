import Image from "next/future/image";

const gumletLoader = ({src, width, quality}) => {
	return `https://treatdaoipfs.gumlet.io/${src}w=${width}&q=${quality || 75}`;
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

const OptimizedNFTImage = (props: OptimizedImageProps) => {
	return (
		<Image
			loader={gumletLoader}
			quality={props.quality}
			src={`${props.src}`}
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

export default OptimizedNFTImage;
