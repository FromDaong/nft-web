import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useWallet } from "use-wallet";
import useTokenBalance from "../../hooks/useTokenBalance";

// import blur from "/assets/blur.png";
// import "./index.scss";

const BalanceModal = ({ show, handleClose, account }) => {
  const myBalance = useTokenBalance(account);

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
            {myBalance.toNumber()} $TREAT
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-md-6">
              <a
                href="https://pancakeswap.info/pair/0x7d3343bb04d897e928856eb287d2e8e1410ee333"
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
