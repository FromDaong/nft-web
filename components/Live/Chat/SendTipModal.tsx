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
import { useContext, useEffect, useState } from "react";

import { ChevronDownIcon } from "@chakra-ui/icons";
import { LiveStreamChatContext } from "../../../contexts/Chat";

const bnb_amounts = {
  BNB: [0.01, 0.025, 0.1, 0.5, 1, 5],
  TREAT: [100, 250, 500, 1000, 5000, 10000],
  USDC: [5, 10, 25, 50, 1000, 250],
};

const currency_addresses = {
  bnb: "0x0000000000000000000000000000000000000000",
  treat: "0xac0c7d9b063ed2c0946982ddb378e03886c064e6",
  usdc: "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d",
};

export default function SendTipModal({ isOpen, onClose }) {
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selected_currency_address, setSelectedCurrencyAddress] =
    useState(null);

  const { sendTip, host } = useContext(LiveStreamChatContext);

  const current_currency =
    Object.keys(currency_addresses).find(
      (key) => currency_addresses[key] === selected_currency_address
    ) ?? "bnb";

  const sendTipToCreator = () => {
    const currency_address = selected_currency_address;
    const creator_address = host;
    setLoading(true);
    sendTip(currency_address, creator_address, selected, current_currency)
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

  useEffect(() => {
    setSelectedCurrencyAddress(
      localStorage?.getItem("selected_currency_address") ??
        currency_addresses.bnb
    );
  }, []);

  useEffect(() => {
    if (selected_currency_address) {
      localStorage.setItem(
        "selected_currency_address",
        selected_currency_address
      );
    }
  }, [selected_currency_address]);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Send Tip</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box>
              <Flex mb={4} justifyContent="space-between">
                <Text></Text>
                <Flex>
                  <Menu>
                    <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                      Currency: {current_currency.toUpperCase()}
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
                {bnb_amounts[current_currency.toUpperCase()].map((amount) => (
                  <GridItem key={amount}>
                    <Button
                      variant={amount === selected ? "solid" : "outline"}
                      colorScheme={amount === selected && "primary"}
                      w="full"
                      onClick={() => setSelected(amount)}
                    >
                      {amount} {current_currency.toUpperCase()}
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
