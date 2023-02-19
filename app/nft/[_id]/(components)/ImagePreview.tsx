import {Container} from "@packages/shared/components/Container";
import OptimizedImage from "@packages/shared/components/OptimizedImage";
import OptimizedNFTImage from "@packages/shared/components/OptimizedImage/OptimizedNFTImage";

const ImagePreview = () => {
	const [showFullScreen, setShowFullScreen] = useState(false);
	const [loadHD, setLoadHD] = useState(false);
	const [imageURL, setImageURL] = useState("");
	useFullScreen("nft_image", showFullScreen);

	useEffect(() => {
		TreatCore.triggerEvent("post_impression", {
			_id: nft._id,
			nftId: nft.id,
		});
	}, []);

	const ipfs_parts = nft.image?.ipfs.split("/");
	const ipfs_id = ipfs_parts[ipfs_parts.length - 1];

	const blurred_image = `${ipfs_id}?blurhash=true`;
	const sd_image = `${ipfs_id}?`;
	const hd_image = `${ipfs_id}?`;

	useEffect(() => {
		if (nft.protected && !isOwned) {
			setImageURL(blurred_image);
			return;
		}

		if (!loadHD) {
			setImageURL(sd_image);
			return;
		}

		if (loadHD) {
			setImageURL(hd_image);
			return;
		}
	}, [nft.protected, isOwned, loadHD]);

	return (
		<Container
			className="w-full 2xl:h-[80vh] lg:h-[90vh] h-[calc(100vh-64px)] flex items-center justify-center"
			css={{backgroundColor: "$surfaceOnSurface"}}
		>
			<Container className="container flex-1 h-full py-12">
				<Container
					className="relative w-full h-full"
					onClick={() => setShowFullScreen(!showFullScreen)}
					id={"nft_image"}
				>
					{nft.protected && !isOwned && (
						<OptimizedImage
							src={imageURL}
							className="cursor-zoom-in"
							sizes="100vw"
							fill
							objectFit="contain"
							alt={nft.name}
						/>
					)}
					{nft.protected && isOwned && (
						<OptimizedNFTImage
							src={sd_image}
							className="cursor-zoom-in"
							sizes="100vw"
							fill
							objectFit="contain"
							alt={nft.name}
						/>
					)}
					{!nft.protected && (
						<OptimizedNFTImage
							src={hd_image}
							className="cursor-zoom-in"
							sizes="100vw"
							fill
							objectFit="contain"
							alt={nft.name}
							quality={100}
						/>
					)}
				</Container>
			</Container>
		</Container>
	);
};

export default ImagePreview;
