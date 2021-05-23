import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useWallet } from "use-wallet";

const AlertModal = ({ show, handleClose }) => {
  return (
    <>
      <Modal show={show} onHide={handleClose} centered>
        <div>
          <Modal.Body>
          Note: BSC Wallet does not support signing, so you won't be able to reveal NFTs using it.<br />
          You can transfer NFTs to a supported wallet (MetaMask or Trust Wallet) from the My NFTs page.
          </Modal.Body>
          <Button onClick={handleClose}>
            Connect
          </Button>
        </div>
      </Modal>
    </>
  );
};

const WalletModal = ({ show, handleClose }) => {
  const { connect, error } = useWallet();
  const [bscModalShow, setBscModalShow] = useState(false);

  const connectToWallet = (provider) => {
    connect(provider);
    localStorage.setItem("connectedBefore", true);
  };

  const smartConnectToMetamask = async () => {
    if (error && error.name === "ChainUnsupportedError") {
      const provider = window.ethereum;
      if (provider) {
        try {
          await provider.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: `0x38`,
                chainName: "Binance Smart Chain",
                nativeCurrency: {
                  name: "BNB",
                  symbol: "BNB",
                  decimals: 18,
                },
                // rpcUrls: ["https://bsc-dataseed2.defibit.io"],
                // blockExplorerUrls: ["https://bscscan.com"],
                rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545/"],
                blockExplorerUrls: ["https://testnet.bscscan.com"],
              },
            ],
          });
        } catch (error) {
          console.error(error);
        }
      }
    }

    connectToWallet();
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
          <Button className="mb-2 w-100" onClick={() => smartConnectToMetamask()}>
            Connect via MetaMask
          </Button>
          <br />
          <Button
            variant="info"
            className="mb-2 w-100"
            onClick={() => connectToWallet("walletconnect")}
          >
            Connect via WalletConnect
          </Button>
          <Button
            variant="warning"
            className="w-100"
            onClick={() => {
              handleClose();
              setBscModalShow(true);
            }}
          >
            Connect via Binance Chain Wallet
          </Button>
        </Modal.Body>
        {/* <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
        </Modal.Footer> */}
      </Modal>
      <AlertModal
        show={bscModalShow}
        handleClose={() => {
          setBscModalShow(false);
          connectToWallet("bsw");
        }}
      />
    </>
  );
};

export default WalletModal;
