import Image from "next/image";

let dev = false;
if (typeof window !== "undefined") {
	dev = window.origin === "http://localhost:3000";
}

const gumletLoader = ({src}) => {
	if (dev) return;

	return `${src}`;
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
			src={`/api/v3/media/https://treatdaoipfs.gumlet.io/${props.src}`}
			alt={props.alt}
			width={props.height}
			height={props.height}
			className={props.className}
			sizes={props.sizes}
			style={{objectFit: props.objectFit}}
			loading={"lazy"}
		/>
	);
};

export default OptimizedImage;
