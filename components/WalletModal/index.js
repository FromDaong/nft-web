import { Button } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import { useMoralis } from "react-moralis";

const WalletModal = ({ show, handleClose }) => {
  const { authenticate } = useMoralis();

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
        "BPe6vuRLN_FFW_BWpH6pIKoktC0w7F6epw1vC4SNo-T2WaGXmPhJbZ2viFg29XVwt_U-nRog5dJ4ugiG0Zju35s",
      signingMessage: "Sign with your wallet to continue",
    });
  };

  return (
    <>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <div>
            <Modal.Title>Connect to Wallet</Modal.Title>
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
            Connect via MetaMask
          </Button>
          <br />
          <Button
            colorScheme={"purple"}
            className="mb-2 w-100"
            onClick={() => smartConnectWithMoralis("walletconnect")}
          >
            Connect via WalletConnect
          </Button>
          <Button
            colorScheme={"yellow"}
            className="w-100"
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
