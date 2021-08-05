import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import usePurchaseOrder from "../../hooks/usePurchaseOrder";
import useGetResaleOrder from "../../hooks/useGetResaleOrder";
import useGetRemainingOrderBalance from "../../hooks/useGetRemainingOrderBalance";

const PurchaseOrderModal = ({
  account,
  show,
  handleClose,
  data,
  order,
  setPendingModal,
  openCompleteModal,
}) => {
  if (!data) return <div></div>;

  console.log({ listData: data });

  const remainingBalance = useGetRemainingOrderBalance(account, data.id);
  const orderData = { ...order, remainingBalance };
  console.log({ listCancelOrder: order });

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <div>
          <Modal.Title>Purchase NFT 🛒</Modal.Title>
          <p className="mb-0 mt-2">
            Are you sure you would you like to purchase: <b>"{data.name}"</b>?
          </p>
        </div>
      </Modal.Header>
      <PurchaseOrderModalBody
        order={order}
        orderData={orderData}
        handleClose={handleClose}
        setPendingModal={setPendingModal}
        openCompleteModal={openCompleteModal}
      />
    </Modal>
  );
};

export const PurchaseOrderModalBody = ({
  order,
  handleClose,
  setPendingModal,
  openCompleteModal,
}) => {
  console.log({ order });
  const { onPurchaseOrder } = usePurchaseOrder(
    order?.nftId,
    order?.quantity,
    order?.price,
    order?.seller
  );

  const purchaseOrderFunc = async () => {
    onPurchaseOrder().then((x) => {
      handleClose();
      setPendingModal(false);
      if (x) openCompleteModal();
    });

    handleClose();
    setPendingModal(true);
  };

  return (
    <Modal.Body>
      <div className="row">
        <div className="col-md-6">
          <Button
            variant="info"
            type="submit"
            className="w-100"
            onClick={async () => purchaseOrderFunc()}
          >
            Submit
          </Button>
        </div>
        <div className="col-md-6">
          <Button
            variant="primary"
            className="mb-2 w-100"
            onClick={() => handleClose()}
          >
            Cancel
          </Button>
        </div>
      </div>
    </Modal.Body>
  );
};

export default PurchaseOrderModal;
