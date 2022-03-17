import { Button, Spinner } from "react-bootstrap";

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
        <Modal.Body>
          <Button
            variant="primary"
            className="mb-2 w-100"
            onClick={() => smartConnectWithMoralis()}
          >
            {isAuthenticating ? (
              <Spinner
                animation="border"
                role="status"
                size="xl"
                style={{ marginTop: 5 }}
              />
            ) : (
              "Connect via MetaMask"
            )}
          </Button>
          <br />
          <Button
            variant="info"
            className="mb-2 w-100"
            onClick={() => smartConnectWithMoralis("walletconnect")}
          >
            {isAuthenticating ? (
              <Spinner
                animation="border"
                role="status"
                size="xl"
                style={{ marginTop: 5 }}
              />
            ) : (
              "Connect via WalletConnect"
            )}
          </Button>
          <Button variant="warning" className="w-100" onClick={web3authConnect}>
            {isAuthenticating ? (
              <Spinner
                animation="border"
                role="status"
                size="xl"
                style={{ marginTop: 5 }}
              />
            ) : (
              "Connect via Web3Auth"
            )}
          </Button>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default WalletModal;
