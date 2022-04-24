import {
  Box,
  Button,
  Flex,
  GridItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";

import { LiveStreamChatContext } from "../../../contexts/Chat";
import { useContext } from "react";

const bnb_amounts = [0.001, 0.01, 0.05, 0.1, 0.25, 0.5, 1, 2, 5, 10];

export default function SendTipModal({ isOpen, onClose }) {
  const { sendTip } = useContext(LiveStreamChatContext);
  const sendTipToCreator = (amount) => {
    const currency_address = "";
    const creator_address = "";
  };
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Send Tip</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box>
              <Flex justifyContent="space-between">
                <Text></Text>
                <Flex></Flex>
              </Flex>
              <SimpleGrid columns={[3, 3, 5, 5]} spacing={[4, 4, 6, 6]}>
                {bnb_amounts.map((amount) => (
                  <GridItem key={amount}>
                    <Button
                      variant="outline"
                      onClick={() => sendTipToCreator(amount)}
                    >
                      {amount} BNB
                    </Button>
                  </GridItem>
                ))}
              </SimpleGrid>
            </Box>
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
