import { Button } from "@chakra-ui/react";
import Modal from "react-bootstrap/Modal";
import { useMoralis } from "react-moralis";

const WalletModal = ({ show, handleClose }) => {
  const { authenticate, isAuthenticating } = useMoralis();

  const smartConnectWithMoralis = async (wallet) => {
    if (wallet === "walletconnect") {
      authenticate({
        provider: "walletconnect",
        chainId: 56,
        signingMessage: "Sign with your wallet to continue",
      });
    } else {
      authenticate({
        provider: "metamask",
        chainId: 56,
        signingMessage: "Sign with your wallet to continue",
      });
    }
  };

  const web3authConnect = () => {
    authenticate({
      provider: "web3Auth",
      chainId: "0x38",
      clientId:
        "BMUF4XcCUy62JfBjwO5Rb1DcYlhEIDf66aifsTtJPTQCat2tlFC3_eijeO9q-AcHGL-HsiMf4qxRjzkXmOC_dEs",
      signingMessage: "Sign with your wallet to continue",
    });
  };

  return (
    <>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <div>
            <Modal.Title>Connect your Wallet</Modal.Title>
            <p className="mb-0 mt-1">
              Please ensure your wallet is connected to the Binance Smart Chain.
            </p>
          </div>
        </Modal.Header>
        <Modal.Body className="flex flex-col">
          <Button
            isFullWidth
            isLoading={isAuthenticating}
            className="bg-primary text-white font-bold mb-2"
            onClick={() => smartConnectWithMoralis()}
          >
            Connect via MetaMask
          </Button>
          <Button
            isFullWidth
            colorScheme="purple"
            className="mb-2"
            isLoading={isAuthenticating}
            onClick={() => smartConnectWithMoralis("walletconnect")}
          >
            Connect via WalletConnect
          </Button>
          <Button
            isFullWidth
            isLoading={isAuthenticating}
            colorScheme="yellow"
            onClick={web3authConnect}
          >
            Connect via Web3Auth
          </Button>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default WalletModal;
