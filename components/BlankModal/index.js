import React, { useState } from "react";
import { Button } from "@chakra-ui/react";
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
  centered,
  hideClose,
}) => {
  const router = useRouter();
  const reload = () => {
    router.reload();
    handleClose();
  };
  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        centered
        backdrop="static"
        className={centered && "text-center"}
      >
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
          {!hideClose && (
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default BlankModal;
