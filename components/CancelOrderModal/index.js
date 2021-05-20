import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import useCancelOrder from "../../hooks/useCancelOrder";
import useGetResaleOrder from "../../hooks/useGetResaleOrder";
import useGetRemainingOrderBalance from "../../hooks/useGetRemainingOrderBalance";

const WalletModal = ({ account, show, handleClose, data }) => {

  if (!data) return <div></div>;

  console.log({listData: data})

  const order = useGetResaleOrder(data.id, account)
  const remainingBalance = useGetRemainingOrderBalance(account, data.id);
  const orderData = {...order, remainingBalance}
  console.log({listCancelOrder: order})

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <div>
          <Modal.Title>Cancel</Modal.Title>
          <p className="mb-0 mt-2">
            <b>NFT Name:</b> "{data.name}"
          </p>
        </div>
      </Modal.Header>
        <CancelOrderModalBody data={data} orderData={orderData} />
    </Modal>
  );
};

export const CancelOrderModalBody = ({ data, orderData }) => {
  console.log({cancelData: data})
  const { onCancelOrder } = useCancelOrder(data?.id ?? 0);

  return (
    <Modal.Body>
    <div>Sales: {orderData.remainingBalance} / {orderData.quantity} Available</div>
      <div className="row">
        <div className="col-md-6">
          <Button
            variant="info"
            type="submit"
            className="w-100"
            onClick={async () =>
              await onCancelOrder(
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
