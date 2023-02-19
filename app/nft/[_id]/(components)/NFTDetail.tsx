import NFTPresentationComponent from "@packages/post/BuyNFTPageViewNFT";
import {Container} from "@packages/shared/components/Container";

const NFTDetail = () => {
	return (
		<Container className="px-8">
			<NFTPresentationComponent
				nft={nft}
				isOwned={isOwned}
				balance={balance}
				openFullScreen={() => setShowFullScreen(true)}
				loadHD={() => setLoadHD(true)}
				address={address}
				seller={seller}
				isResale={isResale}
				event={event}
			/>
		</Container>
	);
};

export default NFTDetail;
