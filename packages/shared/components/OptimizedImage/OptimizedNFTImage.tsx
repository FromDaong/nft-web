import Image from "next/future/image";

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
			quality={props.quality}
			src={`https://www.treatdao.com/api/v2/utils/images/fetchWithFallback?default=${props.src}`}
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
