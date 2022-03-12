import React, { useState } from "react";
import { Form } from "react-bootstrap";
import { Button } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import { useWallet } from "use-wallet";
import useTransferNfts from "../../hooks/useTransferNfts";

const WalletModal = ({ show, handleClose, data }) => {
  const { connect, error } = useWallet();

  const { onTransferNfts } = useTransferNfts();
  const [toAddress, setToAddress] = useState("");
  const [transferAmount, setTransferAmount] = useState(0);

  if (!data) return <div></div>;

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <div>
          <Modal.Title>Transfer NFT</Modal.Title>
          <p className="mb-0 mt-2">
            <b>NFT Name:</b> "{data.name}"
          </p>
          <p className="mb-0 mt-2">
            Transfer your NFT to another wallet. Please make sure both wallets
            are on the Binance Smart Chain.
          </p>
        </div>
      </Modal.Header>
      <Modal.Body>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Recipient Address</Form.Label>
          <Form.Control
            type="email"
            onChange={(e) => setToAddress(e.currentTarget.value)}
            placeholder="0x123"
          />
          <Form.Text className="text-muted">
            Ensure this is a BEP-20 Address.
          </Form.Text>
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label>Amount</Form.Label>
          <Form.Control
            type="number"
            defaultValue={0}
            onChange={(e) => setTransferAmount(e.currentTarget.value)}
          />
          <Form.Text className="text-muted">
            How many of these NFTs do you want to transfer?
          </Form.Text>
        </Form.Group>
        <div className="row">
          <div className="col-md-6">
            <Button
              variant="info"
              type="submit"
              className="w-100"
              onClick={async () =>
                await onTransferNfts(toAddress, data.id, transferAmount)
              }
            >
              Submit
            </Button>
          </div>
          <div className="col-md-6">
            <Button
              variant="primary w-100"
              className="mb-2 w-100"
              onClick={() => null}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal.Body>
      {/* <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
        </Modal.Footer> */}
    </Modal>
  );
};

export default WalletModal;
