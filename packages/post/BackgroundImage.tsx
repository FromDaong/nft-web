import OptimizedImage from "@packages/shared/components/OptimizedImage";

const BackgroundImage = ({caption, isProtected, _id}) => {
	return (
		<>
			<img
				alt={caption}
				src={`/api/v3/image/nft/${_id}/${isProtected ? "blur" : "thumbnail"}`}
				className="rounded-xl w-full h-full object-cover"
			/>
		</>
	);
};

export default BackgroundImage;
