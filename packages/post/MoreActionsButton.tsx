import {DropdownMenuItem} from "@packages/Dropdowns";
import {useDisclosure} from "@packages/hooks";
import ListOrderModal from "@packages/modals/ListOrderModal";
import RemoveListingModal from "@packages/modals/RemoveListingModal";
import TransferNFTModal from "@packages/modals/TransferNFTModal";
import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import {ImportantText, Text} from "@packages/shared/components/Typography/Text";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {DotsHorizontalIcon} from "@radix-ui/react-icons";

export default function MoreActionsButton({
	nft,
	seller,
	hasOpenOrders,
	address,
	numberOfNFTsOwned,
}: {
	nft: any;
	seller?: any;
	hasOpenOrders?: boolean;
	address?: any;
	numberOfNFTsOwned: number;
}) {
	const {
		onOpen: onOpenRemoveModal,
		onClose: onCloseRemoveModal,
		isOpen: isRemoveModalOpen,
	} = useDisclosure();

	const {
		onOpen: onOpenListOrderModal,
		onClose: onCloseListOrderModal,
		isOpen: isListOrderModalOpen,
	} = useDisclosure();

	const {
		onOpen: onOpenTransferModal,
		onClose: onCloseTransferModal,
		isOpen: isTransferModalOpen,
	} = useDisclosure();

	return (
		<Container className="flex gap-4">
			{isListOrderModalOpen && (
				<ListOrderModal
					isOpen={isListOrderModalOpen}
					onClose={onCloseListOrderModal}
					nft={nft}
				/>
			)}

			{isRemoveModalOpen && (
				<RemoveListingModal
					isOpen={isRemoveModalOpen}
					onClose={onCloseRemoveModal}
					nft={nft}
				/>
			)}

			{numberOfNFTsOwned > 0 && isTransferModalOpen && (
				<TransferNFTModal
					isOpen={isTransferModalOpen}
					onClose={onCloseTransferModal}
					nft={nft}
					balance={numberOfNFTsOwned}
				/>
			)}
			{!hasOpenOrders && seller?.address !== address && (
				<Button
					onClick={onOpenListOrderModal}
					className="flex gap-2 px-4 py-2"
				>
					<Text>
						<ImportantText>List for resale</ImportantText>
					</Text>
				</Button>
			)}
			{numberOfNFTsOwned > 0 && (
				<Button
					onClick={onOpenTransferModal}
					className="flex gap-2 px-4 py-2"
				>
					<Text>
						<ImportantText>Transfer to address</ImportantText>
					</Text>
				</Button>
			)}
			{hasOpenOrders && (
				<Button
					onClick={onOpenRemoveModal}
					className="flex gap-2 px-4 py-2"
				>
					<Text>
						<ImportantText>Remove my listing</ImportantText>
					</Text>
				</Button>
			)}
		</Container>
	);
}
