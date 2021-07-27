import React, { useState } from "react";
import { Form } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import useListOrder from "../../hooks/useListOrder";
import useGetMinterIsApprovedForAll from "../../hooks/useGetMinterIsApprovedForAll";
import useApproveMarketplace from "../../hooks/useApproveMarketplace";

const WalletModal = ({ show, handleClose, data }) => {
  const isApprovedForAll = useGetMinterIsApprovedForAll();
  const { onApprove } = useApproveMarketplace();

  if (!data) return <div></div>;

  console.log({ listApproval: isApprovedForAll });
  console.log({ listData: data });

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <div>
          <Modal.Title>List NFT on Marketplace</Modal.Title>
          <p className="mb-0 mt-2">
            <b>NFT Name:</b> "{data.name}"
          </p>
        </div>
      </Modal.Header>
      {!!isApprovedForAll ? (
        <ListOrderModalBody data={data} />
      ) : (
        <ApproveMarketplace onApprove={onApprove} />
      )}
    </Modal>
  );
};

export const ApproveMarketplace = ({ onApprove }) => {
  return <Button onClick={onApprove}>Approve</Button>;
};

export const ListOrderModalBody = ({ data }) => {
  const { onListOrder } = useListOrder();
  const [listPrice, setListPrice] = useState(0);
  const [listQuantity, setListQuantity] = useState(1);
  const maxUnixTimestamp = 2147483647;
  const [listExpires, setListExpires] = useState(maxUnixTimestamp);

  return (
    <Modal.Body>
      <Form.Group controlId="formPrice">
        <Form.Label>List Price in BNB</Form.Label>
        <Form.Control
          type="number"
          onChange={(e) => setListPrice(e.currentTarget.value)}
          placeholder="0"
        />
        <Form.Text className="text-muted">
          This is the price for someone to buy your NFT
        </Form.Text>
      </Form.Group>
      <Form.Group controlId="formQuantity">
        <Form.Label>Quantity</Form.Label>
        <Form.Control
          type="number"
          onChange={(e) => setListQuantity(e.currentTarget.value)}
          placeholder="0"
        />
        <Form.Text className="text-muted">
          You can sell multiple of a particular NFT, in a single listing
        </Form.Text>
      </Form.Group>
      {/* <Form.Group controlId="formExpires">
        <Form.Label>Expiration Date</Form.Label>
        <Form.Control
          type="date"
          onChange={(e) => setListExpires(e.currentTarget.value)}
        />
        <Form.Text className="text-muted">
          Leave blank for unexpiring order
        </Form.Text>
      </Form.Group> */}
      <div className="row">
        <div className="col-md-6">
          <Button
            variant="info"
            type="submit"
            className="w-100"
            onClick={async () =>
              await onListOrder(
                data.id,
                listQuantity,
                listPrice,
                listExpires ?? maxUnixTimestamp
              )
            }
          >
            Submit
          </Button>
        </div>
        <div className="col-md-6">
          <Button variant="primary" className="mb-2 w-100" onClick={() => null}>
            Cancel
          </Button>
        </div>
      </div>
    </Modal.Body>
  );
};

export default WalletModal;
