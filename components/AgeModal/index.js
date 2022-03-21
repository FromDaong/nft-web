import {Button} from "@chakra-ui/react"import Modal from "react-bootstrap/Modal";

// import blur from "/assets/blur.png";
// import "./index.scss";

const AgeModal = ({ show, handleClose }) => {
  const ageVerified = () => {
    localStorage.setItem("ageVerified", true);
    handleClose();
  };

  return (
    <>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Body>
          <Modal.Title className="text-center w-100 mt-2 font-weight-bolder">
            Please confirm your age.
          </Modal.Title>
          <p className="text-center mt-1 mb-4">
            You must be 18+ to use TreatDAO.
          </p>
          <div className="row">
            <div className="col-md-6">
              <Button className="mb-2 w-100" onClick={() => ageVerified()}>
                I'm over 18
              </Button>
            </div>
            <div className="col-md-6">
              <a href="https://fortnite.com/">
                <Button variant={"secondary"} className="mb-2 w-100">
                  Take me away!
                </Button>
              </a>
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

export default AgeModal;
