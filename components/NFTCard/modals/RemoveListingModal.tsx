import PortfolioPublicListingCard from "@components/NFTCard/cards/PortfolioListingCard";
import GenericChainModal from "@packages/modals/GenericChainModal";
import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import {useUser} from "core/auth/useUser";
import Link from "next/link";

export default function RemoveListingModal({isOpen, onClose, nft}) {
	const {profile} = useUser();

	return (
		<GenericChainModal
			isOpen={isOpen}
			title={"Remove listing"}
			subtitle={"Are you sure you want to remove this listing?"}
			hideClose
			noButton
			onClose={onClose}
		>
			<Container className="flex flex-col gap-4"></Container>
		</GenericChainModal>
	);
}
