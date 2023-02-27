import OptimizedImage from "@packages/shared/components/OptimizedImage";
import OptimizedNFTImage from "@packages/shared/components/OptimizedImage/OptimizedNFTImage";

const BackgroundImage = ({caption, isProtected, ipfs, _id}) => {
	if (isProtected) {
		return (
			<OptimizedImage
				objectFit={"cover"}
				alt={caption}
				src={`/api/v3/image/nft/${_id}/blur`}
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
