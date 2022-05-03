import {
  Box,
  Button,
  Flex,
  GridItem,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
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

import { ChevronDownIcon } from "@chakra-ui/icons";
import { LiveStreamChatContext } from "../../../contexts/Chat";

const bnb_amounts = [0.1, 0.5, 1, 2, 5, 10];
const currency_addresses = {
  bnb: "0x0000000000000000000000000000000000000000",
  treat: "",
  usdc: "",
};

export default function SendTipModal({ isOpen, onClose }) {
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [denomination, setDenomination] = useState<"fiat" | "base">("fiat");
  const [selected_currency_address, setSelectedCurrencyAddress] = useState(
    localStorage?.get("selected_currency_address") ?? currency_addresses.bnb
  );

  const { sendTip, host } = useContext(LiveStreamChatContext);
  const sendTipToCreator = () => {
    const currency_address = selected_currency_address;
    const creator_address = host;
    setLoading(true);
    sendTip(currency_address, creator_address, selected)
      .then(() => setLoading(false))
      .catch((err) => {
        console.log({ err });
        setLoading(false);
      });
  };

  const closeModal = () => {
    setSelected(null);
    onClose();
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
                <Flex>
                  <Menu>
                    <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                      Currency: {selected_currency_address}
                    </MenuButton>
                    <MenuList>
                      <MenuItem
                        onClick={() =>
                          setSelectedCurrencyAddress(currency_addresses.bnb)
                        }
                      >
                        BNB
                      </MenuItem>
                      <MenuItem
                        onClick={() =>
                          setSelectedCurrencyAddress(currency_addresses.treat)
                        }
                      >
                        TREAT
                      </MenuItem>
                      <MenuItem
                        onClick={() =>
                          setSelectedCurrencyAddress(currency_addresses.usdc)
                        }
                      >
                        USDC
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </Flex>
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
                <GridItem colSpan={3}>
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
              onClick={sendTipToCreator}
              disabled={!selected}
              isLoading={loading}
            >
              Send Tip
            </Button>
            <Button variant="ghost" onClick={closeModal}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
