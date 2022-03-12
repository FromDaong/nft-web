import React from "react";
import { Button } from "@chakra-ui/react";
import Modal from "react-bootstrap/Modal";
import useCancelOrder from "../../hooks/useCancelOrder";
import useGetResaleOrder from "../../hooks/useGetResaleOrder";
import useGetRemainingOrderBalance from "../../hooks/useGetRemainingOrderBalance";

const CancelOrderModal = ({
  account,
  show,
  handleClose,
  data,
  setPendingModal,
  openCompleteModal,
}) => {
  if (!data) return <div></div>;

  const order = useGetResaleOrder(data.id, account);
  const remainingBalance = useGetRemainingOrderBalance(account, data.id);
  const orderData = { ...order, remainingBalance };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <div>
          <Modal.Title>Remove NFT Listing ❌</Modal.Title>
          <p className="mb-0 mt-2">
            Your <b>"{data.name}"</b> NFT will no longer be available on the
            resale marketplace.
          </p>
        </div>
      </Modal.Header>
      <CancelOrderModalBody
        data={data}
        orderData={orderData}
        handleClose={handleClose}
        setPendingModal={setPendingModal}
        openCompleteModal={openCompleteModal}
      />
    </Modal>
  );
};

export const CancelOrderModalBody = ({
  data,
  handleClose,
  setPendingModal,
  openCompleteModal,
}) => {
  const { onCancelOrder } = useCancelOrder(data?.id ?? 0);

  const cancelOrderFunc = async () => {
    onCancelOrder().then((x) => {
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
            onClick={async () => cancelOrderFunc()}
          >
            Submit
          </Button>
        </div>
        <div className="col-md-6">
          <Button
            colorScheme="pink"
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

export default CancelOrderModal;
