import { Button } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import { getDisplayBalance } from "../../utils/formatBalance";
import useTokenBalance from "../../hooks/useTokenBalance";

// import blur from "/assets/blur.png";
// import "./index.scss";

const BalanceModal = ({ show, handleClose }) => {
  const myBalance = useTokenBalance(
    "0x01bd7acb6fF3B6Dd5aefA05CF085F2104f3fC53F"
  );

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
                href="https://pancakeswap.finance/swap?inputCurrency=0x01bd7acb6ff3b6dd5aefa05cf085f2104f3fc53f"
                target="_blank"
                rel="noreferrer"
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
