import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Link from "next/link";

// import blur from "/assets/blur.png";
// import "./index.scss";

const WalletModal = ({ show, handleClose }) => {
  return (
    <>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <div>
            <Modal.Title>Purchase Complete ✅ 💝</Modal.Title>
          </div>
        </Modal.Header>
        <Modal.Body>
          <p className="mb-0 mt-1">
            {`Your transaction is now confirming. This usually takes < 1 minute.
            View your purchase on "My NFTs".`}
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Link href="/my-nfts">
            <a>
              <Button>Go to My NFTs</Button>
            </a>
          </Link>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default WalletModal;
