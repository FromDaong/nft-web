import {Dialog} from "@headlessui/react";
import {DialogOverlay} from "..";
import {styled} from "@styles/theme";
import {Container} from "@packages/shared/components/Container";
import {Button} from "@packages/shared/components/Button";
import {XIcon} from "@heroicons/react/outline";
import {useDisclosure} from "@packages/hooks";
import TransferNFTModal from "../TransferNFTModal";
import ListOrderModal from "../ListOrderModal";
import ApplicationFrame from "core/components/layouts/ApplicationFrame";
import {SendIcon, ShoppingBag} from "lucide-react";
import {FrostyBackgroundContainer} from "@components/NFTCard/misc/FrostyBackground";

type ImagePreviewProps = {
	url: string;
	onClose: () => void;
	isOpen: boolean;
	title: string;
	isMine?: boolean;
	balance?: number;
	nft?: any;
};

export const DialogContent = styled(Dialog.Panel, {
	backgroundColor: "$overlay",
	backdropFilter: "blur(10px)",
	borderRadius: "0",
	boxShadow:
		"hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px",
	position: "fixed",
	top: "0",
	left: "0",
	width: "100dvw",
	height: "100dvh",
	animation: "contentShow 150ms cubic-bezier(0.16, 1, 0.3, 1)",
	zIndex: 1200,
	overflow: "hidden",
	padding: "1.2rem",
});

export default function FullscreenImagePreviewModal(props: ImagePreviewProps) {
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
		<Dialog
			open={props.isOpen}
			onClose={props.onClose}
		>
			<DialogOverlay />
			{isSendNFTModalOpen && (
				<TransferNFTModal
					isOpen={isSendNFTModalOpen}
					onClose={onSendNFTModalClose}
					nft={props.nft}
					balance={props.balance}
				/>
			)}
			{isListForSaleModalOpen && (
				<ListOrderModal
					isOpen={isListForSaleModalOpen}
					onClose={onListForSaleModalClose}
					nft={props.nft}
					balance={parseInt(`${props.balance}`)}
				/>
			)}

			{
				//@ts-ignore
				<DialogContent>
					<Container className="relative w-full h-full gap-8 p-8">
						<Container className="absolute top-0 right-0">
							<Button
								css={{padding: "8px"}}
								onClick={props.onClose}
								appearance={"surface"}
							>
								<XIcon className="w-5 h-5" />
							</Button>
						</Container>
						<Container className="flex items-center justify-center flex-1 max-h-[90vh] py-8">
							<img
								src={props.url}
								sizes="100vw"
								alt={props.title}
								className="h-auto max-h-[90vh] shadow-xl aspect-auto"
							/>
						</Container>
						{!isListForSaleModalOpen && !isSendNFTModalOpen && props.isMine && (
							<Container
								css={{
									left: "50%",
									transform: "translateX(-50%)",
								}}
								className="absolute flex-shrink-0 py-8 bottom-4"
							>
								<ApplicationFrame>
									<Container className="flex flex-wrap justify-center w-full gap-4 py-8">
										<Button
											outlined
											appearance={"white"}
											className="shadow-xl"
											onClick={onSendNFTModalOpen}
										>
											<SendIcon className="w-4 h-4" />
											Send to address
										</Button>
										<Button
											outlined
											appearance={"white"}
											className="shadow-xl"
											onClick={onListForSaleModalOpen}
										>
											<ShoppingBag className="w-4 h-5" />
											List for resale
										</Button>
									</Container>
								</ApplicationFrame>
							</Container>
						)}
					</Container>
				</DialogContent>
			}
		</Dialog>
	);
}
