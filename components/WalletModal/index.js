import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useWallet } from "use-wallet";

// import blur from "/assets/blur.png";
// import "./index.scss";

const WalletModal = ({ show, handleClose }) => {
  const { connect } = useWallet();

  return (
    <>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Connect to Wallet</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Button className="mb-2 w-100" onClick={() => connect()}>
            Connect via MetaMask
          </Button>
          <br />
          <Button
            variant="info"
            className="w-100"
            onClick={() => connect("walletconnect")}
          >
            Connect via WalletConnect
          </Button>
        </Modal.Body>
        {/* <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
        </Modal.Footer> */}
      </Modal>
    </>
  );
};

export default WalletModal;
