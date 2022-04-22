import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";

import { LiveStreamChatContext } from "../../../contexts/Chat";
import { useContext } from "react";

export default function SendTipModal({ isOpen, onClose }) {
  const { sendTip } = useContext(LiveStreamChatContext);
  const sendTipToCreator = () => {
    const currency_address = "";
    const creator_address = "";
    const amount = 0;
  };
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Send Tip</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box></Box>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="primary" mr={3} onClick={onClose}>
              Send Tip
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
