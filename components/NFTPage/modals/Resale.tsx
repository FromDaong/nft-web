import {useDisclosure} from "@packages/hooks";

export const ResaleItemWithBuy = ({nft, children}) => {
	const {isOpen, onOpen, onClose} = useDisclosure();
	return <>{children(onOpen)}</>;
};
