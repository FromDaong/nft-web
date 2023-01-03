import OptimizedImage from "@packages/shared/components/OptimizedImage";
import OptimizedNFTImage from "@packages/shared/components/OptimizedImage/OptimizedNFTImage";

const BackgroundImage = ({url, caption, isProtected}) => {
	if (isProtected) {
		return (
			<OptimizedImage
				objectFit={"cover"}
				alt={caption}
				src={url}
				sizes="100vw"
				fill
			/>
		);
	}

	return (
		<>
			<OptimizedNFTImage
				objectFit={"cover"}
				alt={caption}
				src={`${url}`}
				sizes="100vw"
				fill
			/>
		</>
	);
};

export default BackgroundImage;
