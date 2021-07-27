import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Link from "next/link";

// import blur from "/assets/blur.png";
// import "./index.scss";

const BlankModal = ({ show, handleClose }) => {
  return (
    <>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <div>
            <Modal.Title>{title || "Action Complete ✅ 💝"}</Modal.Title>
          </div>
        </Modal.Header>
        <Modal.Body>
          <p className="mb-0 mt-1">
            {subtitle ||
              `Your transaction is now confirming. This usually takes < 1 minute.
            View your purchase on "My NFTs".`}
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Link href={buttonAction || "/marketplace"}>
            <Button>{buttonLabel || "Go to Marketplace"}</Button>
          </Link>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default BlankModal;
