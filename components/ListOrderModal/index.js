import BigNumber from "bignumber.js";
import BlankModal from "../../components/BlankModal";
import { Button } from "react-bootstrap";
import { Form } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import { getDisplayBalance } from "../../utils/formatBalance";
import useApproveMarketplace from "../../hooks/useApproveMarketplace";
import useGetMinterIsApprovedForAll from "../../hooks/useGetMinterIsApprovedForAll";
import useGetOpenOrdersForNft from "../../hooks/useGetOpenOrdersForNft";
import useListOrder from "../../hooks/useListOrder";
import { useState } from "react";

const WalletModal = ({
  show,
  handleClose,
  data,
  setPendingModal,
  openCompleteModal,
}) => {
  const isApprovedForAll = useGetMinterIsApprovedForAll();
  const { onApprove } = useApproveMarketplace();

  if (!data) return <div></div>;

  if (!isApprovedForAll) {
    return (
      <BlankModal
        show={show}
        title={"Approve the Treat Marketplace"}
        subtitle={
          "In order to use the Treat resale marketplace, you must approve our smart contract on your wallet. The smart contract code is publicly available to view. Once complete, wait a few minutes for the transaction to confirm."
        }
        buttonLabel={"Approve in Wallet"}
        buttonAction={onApprove}
        handleClose={handleClose}
        setPendingModal={setPendingModal}
        openCompleteModal={openCompleteModal}
      />
    );
  }

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
      <ListOrderModalBody
        data={data}
        handleClose={handleClose}
        setPendingModal={setPendingModal}
        openCompleteModal={openCompleteModal}
      />
    </Modal>
  );
};

export const ApproveMarketplace = ({ onApprove }) => {
  return <Button onClick={onApprove}>Approve</Button>;
};

export const ListOrderModalBody = ({
  data,
  handleClose,
  setPendingModal,
  openCompleteModal,
}) => {
  const { onListOrder } = useListOrder();
  const [listPrice, setListPrice] = useState(0);
  const [listQuantity, setListQuantity] = useState(1);
  const maxUnixTimestamp = 2147483647;
  const [listExpires, setListExpires] = useState(maxUnixTimestamp);

  const openOrders = useGetOpenOrdersForNft(data.id) ?? [];
  const lowestOpenOrder = new BigNumber(
    openOrders.reduce(
      (lowest, order) => (lowest.price < order.price ? lowest : order),
      { price: 0 }
    ).price
  );

  const cancelOrderFunc = async () => {
    onListOrder(
      data.id,
      listQuantity,
      listPrice,
      listExpires ?? maxUnixTimestamp
    ).then((x) => {
      handleClose();
      setPendingModal(false);
      if (x) openCompleteModal();
    });

    handleClose();
    setPendingModal(true);
  };

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
      <Form.Group>
        <Form.Text className="text-muted">
          Floor price: {getDisplayBalance(lowestOpenOrder)}
        </Form.Text>
      </Form.Group>
      {data.balance > 1 && (
        <Form.Group controlId="formQuantity">
          <Form.Label>Quantity</Form.Label>
          <Form.Control
            type="number"
            value={listQuantity}
            min={1}
            onChange={(e) => setListQuantity(e.currentTarget.value)}
            placeholder="1"
          />
          <Form.Text className="text-muted">
            NFTs are sold out individually, at the list price. Choose the amount
            you wish to list.
          </Form.Text>
        </Form.Group>
      )}
      <div className="row">
        <div className="col-md-6">
          <Button
            variant="info"
            type="submit"
            className="w-100"
            onClick={cancelOrderFunc}
          >
            Submit
          </Button>
        </div>
        <div className="col-md-6">
          <Button
            className="bg-primary text-white font-bold"
            className="mb-2 w-100"
            onClick={() => null}
          >
            Cancel
          </Button>
        </div>
      </div>
    </Modal.Body>
  );
};

export default WalletModal;
