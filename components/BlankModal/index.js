import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useRouter } from "next/router";

// import blur from "/assets/blur.png";
// import "./index.scss";

const BlankModal = ({
  show,
  handleClose,
  title,
  subtitle,
  buttonAction,
  buttonLabel,
  noButton,
}) => {
  const router = useRouter();
  const reload = () => {
    router.reload();
    handleClose();
  };
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
            {subtitle || `Your transaction has now been confirmed!`}
          </p>
        </Modal.Body>
        <Modal.Footer>
          {!noButton && (
            <Button onClick={buttonAction || reload}>
              {buttonLabel || "Finish"}
            </Button>
          )}
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default BlankModal;