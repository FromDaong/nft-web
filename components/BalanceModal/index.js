import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useWallet } from "use-wallet";
import useTokenBalance from "../../hooks/useTokenBalance";
import {
  getBalanceNumber,
  getDisplayBalance,
  getFullDisplayBalance,
} from "../../utils/formatBalance";

// import blur from "/assets/blur.png";
// import "./index.scss";

const BalanceModal = ({ show, handleClose, account }) => {
  const myBalance = useTokenBalance(
    "0x01bd7acb6fF3B6Dd5aefA05CF085F2104f3fC53F"
  );

  const { connect } = useWallet();

  const connectToWallet = (provider) => {
    localStorage.setItem("connectedBefore", true);
    connect(provider);
  };

  return (
    <>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header>
          <Modal.Title className="text-center w-100 font-weight-bolder">
            {getDisplayBalance(myBalance)} $TREAT V2
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-md-6">
              <a
                href="https://app.1inch.io/#/56/swap/BNB/TREAT"
                target="_blank"
              >
                <Button className="mb-2 w-100">Exchange $TREAT</Button>
              </a>
            </div>
            <div className="col-md-6">
              <Button
                variant={"secondary"}
                className="mb-2 w-100"
                onClick={() => handleClose()}
              >
                Close
              </Button>
            </div>
          </div>
        </Modal.Body>
        {/* <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer> */}
      </Modal>
    </>
  );
};

export default BalanceModal;
