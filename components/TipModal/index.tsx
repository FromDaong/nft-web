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
  useToast,
} from "@chakra-ui/react";
import { bnb_amounts, currency_addresses } from "@constants/common";
import { useContext, useEffect, useState } from "react";
import useERC20, {
  ContractInteractionTypes,
  TippingCurrencies,
} from "@hooks/useERC20";

import { ChevronDownIcon } from "@chakra-ui/icons";
import { Context } from "@contexts/TreatProvider";
import Web3 from "web3";
import { contractAddresses } from "@treat/lib/constants";
import { useMoralis } from "react-moralis";

export default function GenericSendTipModal({
  isOpen,
  onClose,
  creator_address,
}) {
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState(null);
  const [selected_currency_address, setSelectedCurrencyAddress] =
    useState(null);
  const [message, setMessage] = useState("");
  const [hasTipApproval, setTipApproval] = useState<boolean>(false);
  const { approval, allowance, balanceOf } = useERC20();
  const { account } = useMoralis();
  const toast = useToast();
  const { treat } = useContext(Context);

  const informUserTip = (amount: string, currency: string) => {
    // user inform
    toast({
      title: "Tip sent",
      description: `${amount} ${currency} tipped to creator`,
      status: "success",
      duration: 3000,
    });
  };

  const current_currency =
    Object.keys(currency_addresses).find(
      (key) => currency_addresses[key] === selected_currency_address
    ) ?? "bnb";

  const sendTipToCreator = () => {
    setLoading(true);
    const currency_address = selected_currency_address;
    executeTip(currency_address, creator_address, amount, current_currency)
      .then(() => setLoading(false))
      .catch((err) => {
        console.log({ err });
        setLoading(false);
      });
  };

  const executeTip = async (
    currency_address: string,
    creator_address: string,
    amount: number | string,
    currency_symbol: string
  ) => {
    let token: TippingCurrencies;
    if (
      currency_address.toUpperCase() ===
      contractAddresses.busdToken[56].toUpperCase()
    ) {
      token = TippingCurrencies.BUSD;
    }
    if (currency_address === "0x0000000000000000000000000000000000000000") {
      token = TippingCurrencies.BNB;
    }
    if (
      currency_address.toUpperCase() ===
      contractAddresses.usdcToken[56].toUpperCase()
    ) {
      token = TippingCurrencies.USDC;
    }
    if (
      currency_address.toUpperCase() ===
      contractAddresses.treat2[56].toUpperCase()
    ) {
      token = TippingCurrencies.TREAT;
    }

    const bal = await balanceOf({
      currency: token,
      interactionType: ContractInteractionTypes.CALL,
    });

    if (parseFloat(Web3.utils.fromWei(bal)) < amount) {
      toast({
        title: "Not Enough Balance!",
        description: `You do not have enough funds in your wallet to send this tip. The contract will fail.`,
        status: "error",
        duration: 3000,
      });
      return;
    }
    amount = Web3.utils.toWei(amount.toString());
    if (message !== "send-tip") {
      if (currency_address === "0x0000000000000000000000000000000000000000") {
        const sentTip = await treat?.contracts.tippingContract.methods
          .sendTip(amount, currency_address, creator_address)
          .send({
            from: account,
            value: amount,
          });

        if (sentTip) {
          informUserTip(Web3.utils.fromWei(amount), currency_symbol);
          return;
        }
      }
      // if the currency address is TREAT, BUSD, or USDC::
      else {
        // this can be changed with proper typings in an enum
        // temporary workaround until completed.
        switch (token) {
          case TippingCurrencies.BUSD: {
            const currentAllowance = await allowance({
              currency: TippingCurrencies.BUSD,
            });
            if (
              parseInt(Web3.utils.fromWei(currentAllowance)) <
              parseInt(Web3.utils.fromWei(amount))
            ) {
              const success = await approval(
                {
                  currency: TippingCurrencies.BUSD,
                  interactionType: ContractInteractionTypes.SEND,
                },
                parseFloat(Web3.utils.fromWei(amount)) > 1000
                  ? amount
                  : Web3.utils.toWei("1000")
              );
              if (success.transactionHash) {
                setTipApproval(true);
              } else {
                setTipApproval(false);
              }
            } else {
              setTipApproval(true);
            }
            break;
          }
          case TippingCurrencies.USDC: {
            const currentAllowance = await allowance({
              currency: TippingCurrencies.USDC,
            });
            if (
              parseInt(Web3.utils.fromWei(currentAllowance)) <
              parseInt(Web3.utils.fromWei(amount))
            ) {
              const success = await approval(
                {
                  currency: TippingCurrencies.USDC,
                  interactionType: ContractInteractionTypes.SEND,
                },
                parseFloat(Web3.utils.fromWei(amount)) > 1000
                  ? amount
                  : Web3.utils.toWei("1000")
              );
              if (success.transactionHash) {
                setTipApproval(true);
              } else {
                setTipApproval(false);
              }
            } else {
              setTipApproval(true);
            }
            break;
          }
          case TippingCurrencies.TREAT: {
            const currentAllowance = await allowance({
              currency: TippingCurrencies.TREAT,
            });

            if (
              parseInt(Web3.utils.fromWei(currentAllowance)) <
              parseInt(Web3.utils.fromWei(amount))
            ) {
              const success = await approval(
                {
                  currency: TippingCurrencies.TREAT,
                  interactionType: ContractInteractionTypes.SEND,
                },
                parseFloat(amount) > 250000
                  ? amount
                  : Web3.utils.toWei("250000")
              );
              if (success.transactionHash) {
                setTipApproval(true);
              } else {
                setTipApproval(false);
              }
            } else {
              setTipApproval(true);
            }
          }
        }
      }
      toast({
        title: "Approval",
        description: `You have approved TreatMinter contract.`,
        status: "success",
        duration: 3000,
      });
    }

    if (hasTipApproval) {
      // set time out to remove weird failure sometimes?
      // setTimeout(async function () {

      const sentTip = await treat?.contracts.tippingContract.methods
        .sendTip(amount, currency_address, creator_address)
        .send({
          from: account,
        });

      if (sentTip) {
        informUserTip(Web3.utils.fromWei(amount), currency_symbol);
        return;
      }
    }

    return;
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

  useEffect(() => {
    const selected_currency = Object.keys(currency_addresses).map((key) => {
      if (currency_addresses[key] === selected_currency_address)
        return key.toUpperCase();
    });

    const selected_currency_symbol = selected_currency.filter(
      (i) => i !== undefined
    )[0];
    if (amount) {
      console.log({ amount });

      allowance({
        currency: TippingCurrencies[selected_currency_symbol],
      })
        .then((currentAllowance) => {
          console.log({ currentAllowance });
          if (currentAllowance < Web3.utils.fromWei(`${amount}`)) {
            setMessage("approval");
          } else {
            setMessage("send-tip");
          }
        })
        .catch((err) => {
          alert(err);
          console.log({ err });
        });
    }
  }, [allowance, balanceOf, amount]);
  console.log({ message });

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
              disabled={!amount || /* message === null  ||*/ loading}
              isLoading={loading /* || message === null */}
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
