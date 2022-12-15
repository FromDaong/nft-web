import OptimizedImage from "@packages/shared/components/OptimizedImage";

const BackgroundImage = ({url, caption, isProtected = false}) => {
	return (
		<>
			<OptimizedImage
				objectFit={"cover"}
				alt={caption}
				src={`${url}${isProtected ? "&blur=30&" : ""}`}
				sizes="100vw"
				fill
			/>
		</>
	);
};

export default BackgroundImage;
