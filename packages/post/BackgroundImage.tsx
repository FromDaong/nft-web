import OptimizedImage from "@packages/shared/components/OptimizedImage";
import OptimizedNFTImage from "@packages/shared/components/OptimizedImage/OptimizedNFTImage";

const BackgroundImage = ({url, caption, isProtected, ipfs, id}) => {
	if (isProtected) {
		return (
			<OptimizedImage
				objectFit={"cover"}
				alt={caption}
				src={`${ipfs}?blurhash=true&id=${id}`}
				sizes="100vw"
				fill
				className="rounded-xl"
			/>
		);
	}

	return (
		<>
			<OptimizedNFTImage
				objectFit={"cover"}
				alt={caption}
				src={`${ipfs}`}
				sizes="100vw"
				fill
				className="rounded-xl"
			/>
		</>
	);
};

export default BackgroundImage;
