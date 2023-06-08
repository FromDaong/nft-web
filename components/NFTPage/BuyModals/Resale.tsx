import {useDisclosure} from "@packages/hooks";

export const ResaleItemWithBuy = ({nft, children}) => {
	const {isOpen, onOpen, onClose} = useDisclosure();
	console.log({isOpen});
	return <>{children(onOpen)}</>;
};
