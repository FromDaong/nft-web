import PortfolioPublicListingCard from "@components/NFTCard/cards/PortfolioListingCard";
import GenericChainModal from "@packages/modals/GenericChainModal";
import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import {useUser} from "core/auth/useUser";
import Link from "next/link";

export default function PurchasedNFTPreview({isOpen, onClose, nft}) {
	const {profile} = useUser();

	return (
		<GenericChainModal
			isOpen={isOpen}
			title={"You have been treated"}
			subtitle={"You have been treated with a NFT."}
			hideClose
			noButton
			onClose={onClose}
		>
			<Container className="flex flex-col gap-4">
				<Container className="flex justify-center max-w-[520px]">
					<PortfolioPublicListingCard
						{...nft}
						count={1}
						overrideOwnership={true}
					/>
				</Container>
				<Container className="flex justify-between">
					<Button
						onClick={onClose}
						appearance={"surface"}
					>
						Close
					</Button>
					<Link href={`/${profile?.username}`}>
						<a>
							<Button appearance={"action"}>View in my portfolio</Button>
						</a>
					</Link>
				</Container>
			</Container>
		</GenericChainModal>
	);
}
