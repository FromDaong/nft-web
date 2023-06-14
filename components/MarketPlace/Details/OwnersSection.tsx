import {useDisclosure} from "@packages/hooks";
import ListOrderModal from "@packages/modals/ListOrderModal";
import TransferNFTModal from "@packages/modals/TransferNFTModal";
import {Tag} from "@packages/post/BuyNFTPageViewNFT";
import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import {ImportantText, Text} from "@packages/shared/components/Typography/Text";
import {SendIcon, ShoppingBag} from "lucide-react";

const OwnersSection = ({nft, balance}) => {
	const {
		isOpen: isSendNFTModalOpen,
		onOpen: onSendNFTModalOpen,
		onClose: onSendNFTModalClose,
	} = useDisclosure();
	const {
		isOpen: isListForSaleModalOpen,
		onOpen: onListForSaleModalOpen,
		onClose: onListForSaleModalClose,
	} = useDisclosure();

	return (
		<>
			{isSendNFTModalOpen && (
				<TransferNFTModal
					isOpen={isSendNFTModalOpen}
					onClose={onSendNFTModalClose}
					nft={nft}
					balance={balance}
				/>
			)}
			{isListForSaleModalOpen && (
				<ListOrderModal
					isOpen={isListForSaleModalOpen}
					onClose={onListForSaleModalClose}
					nft={nft}
					balance={balance}
				/>
			)}
			<Container
				css={{
					backgroundColor: "$elementOnSurface",
					borderColor: "$subtleBorder",
				}}
				className="flex flex-col w-full gap-8 p-4 rounded-xl"
			>
				<Container className="flex items-center w-full gap-2">
					<Text>
						<ImportantText>Owner's section</ImportantText>
					</Text>
					<Tag>{balance} owned</Tag>
				</Container>
				<Container className="flex flex-col justify-between gap-4">
					<Button
						css={{padding: "1rem"}}
						appearance={"surface"}
						outlined
						onClick={onSendNFTModalOpen}
					>
						<SendIcon className="w-5 h-5" />
						Send to address
					</Button>
					<Button
						css={{padding: "1rem"}}
						appearance={"action"}
						onClick={onListForSaleModalOpen}
					>
						<ShoppingBag className="w-5 h-5" />
						List for sale
					</Button>
				</Container>
			</Container>
		</>
	);
};

export default OwnersSection;
