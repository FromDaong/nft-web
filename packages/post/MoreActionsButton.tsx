import {DropdownMenuItem} from "@packages/Dropdowns";
import {useDisclosure} from "@packages/hooks";
import ListOrderModal from "@packages/modals/ListOrderModal";
import RemoveListingModal from "@packages/modals/RemoveListingModal";
import TransferNFTModal from "@packages/modals/TransferNFTModal";
import {Button} from "@packages/shared/components/Button";
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
		<>
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
			<DropdownMenu.Root>
				<DropdownMenu.Trigger className="flex">
					<Button appearance={"surface"}>
						<DotsHorizontalIcon
							width={24}
							height={24}
						/>
						More
					</Button>
				</DropdownMenu.Trigger>
				<DropdownMenu.Portal>
					<DropdownMenu.Content className="z-30 p-3 transition-all duration-150 bg-white shadow-xl gap-y-3 rounded-xl">
						{!hasOpenOrders && seller?.address !== address && (
							<DropdownMenuItem
								onClick={onOpenListOrderModal}
								className="flex gap-2 px-4 py-2"
							>
								<Text>
									<ImportantText>List for resale</ImportantText>
								</Text>
							</DropdownMenuItem>
						)}
						{numberOfNFTsOwned > 0 && (
							<DropdownMenuItem
								onClick={onOpenTransferModal}
								className="flex gap-2 px-4 py-2"
							>
								<Text>
									<ImportantText>Transfer to address</ImportantText>
								</Text>
							</DropdownMenuItem>
						)}
						{hasOpenOrders && (
							<DropdownMenuItem
								onClick={onOpenRemoveModal}
								className="flex gap-2 px-4 py-2"
							>
								<Text>
									<ImportantText>Remove my listing</ImportantText>
								</Text>
							</DropdownMenuItem>
						)}
					</DropdownMenu.Content>
				</DropdownMenu.Portal>
			</DropdownMenu.Root>
		</>
	);
}
