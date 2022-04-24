import {
  Box,
  Button,
  Flex,
  GridItem,
  Input,
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
import { useContext, useState } from "react";

import { LiveStreamChatContext } from "../../../contexts/Chat";

const bnb_amounts = [0.001, 0.01, 0.05, 0.1, 0.25, 0.5, 1, 2, 5, 10];

export default function SendTipModal({ isOpen, onClose }) {
  const [selected, setSelected] = useState(null);
  const { sendTip } = useContext(LiveStreamChatContext);
  const sendTipToCreator = (amount) => {
    const currency_address = "";
    const creator_address = "";
  };
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
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
              <SimpleGrid columns={3} spacing={[4, 4, 6, 6]}>
                {bnb_amounts.map((amount) => (
                  <GridItem key={amount}>
                    <Button
                      variant={amount === selected ? "solid" : "outline"}
                      colorScheme={amount === selected && "primary"}
                      w="full"
                      onClick={() => setSelected(amount)}
                    >
                      {amount} BNB
                    </Button>
                  </GridItem>
                ))}
                <GridItem colSpan={2}>
                  <Input
                    w="full"
                    type="number"
                    min={0.001}
                    variant="filled"
                    placeholder="Custom amount"
                    colorScheme={"primary"}
                    onChange={(e) => setSelected(Number(e.target.value))}
                  />
                </GridItem>
              </SimpleGrid>
            </Box>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="primary"
              mr={3}
              onClick={onClose}
              disabled={!selected}
            >
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
