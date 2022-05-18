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

export default function SendTipModal({ isOpen, onClose }) {
  const [loading, setLoading] = useState(false);

  const {
    sendTip,
    host,
    message,
    bnb_amounts,
    currency_addresses,
    tip_amount: amount,
    setTipAmount: setAmount,
    setSelectedCurrencyAddress,
    selected_currency_address,
  } = useContext(LiveStreamChatContext);
  console.log({ amount, message, selected_currency_address });

  const current_currency =
    Object.keys(currency_addresses).find(
      (key) => currency_addresses[key] === selected_currency_address
    ) ?? "bnb";

  const sendTipToCreator = () => {
    const currency_address = selected_currency_address;
    const creator_address = host;
    setLoading(true);
    sendTip(currency_address, creator_address, amount, current_currency)
      .then(() => setLoading(false))
      .catch((err) => {
        console.log({ err });
        setLoading(false);
      });
  };

  const closeModal = () => {
    setAmount(null);
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
                          setSelectedCurrencyAddress(currency_addresses.busd)
                        }
                      >
                        BUSD
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </Flex>
              </Flex>
              <SimpleGrid columns={3} spacing={[4, 4, 6, 6]}>
                {bnb_amounts[current_currency.toUpperCase()].map((_amount) => (
                  <GridItem key={_amount}>
                    <Button
                      variant={_amount === amount ? "solid" : "outline"}
                      colorScheme={_amount === amount && "primary"}
                      w="full"
                      onClick={() => setAmount(_amount)}
                    >
                      {_amount} {current_currency.toUpperCase()}
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
                    onChange={(e) => setAmount(Number(e.target.value))}
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
              disabled={!amount || message === null || loading}
              isLoading={loading || message === null}
            >
              {message === "send-tip" ? "Send Tip" : "Approve"}
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
