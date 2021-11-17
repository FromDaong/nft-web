import React, { useState } from "react";
import { InputGroup, FormControl, Button } from "react-bootstrap";
import BlankModal from "../components/BlankModal";
import { getDisplayBalance } from "../utils/formatBalance";
import hasApprovedContract from "../hooks/hasApprovedContract";
import useApproveContract from "../hooks/approveContract";
import useStakeFarms from "../hooks/useStakeFarms";
import { useHarvestFarms } from "../hooks/useHarvestFarm";
import { useUnstakeFarms } from "../hooks/useUnstakeFarms";

const Farm = ({ contract, treatBal, title, pid }) => {
  const hasApproved = contract && hasApprovedContract(contract.options.address);
  const { onApprove } =
    contract && useApproveContract(contract.options.address);
  const { onStake } = contract && useStakeFarms(pid);
  const [showPendingModal, setShowPendingModal] = useState(null);
  const [showCompleteModal, setShowCompleteModal] = useState(null);
  const [stakeAmount, setStakeAmount] = useState(0);

  const approveContract = () => {
    setShowPendingModal(true);
    onApprove()
      .then((s) => {
        setShowPendingModal(false);
        if (s) {
          setShowCompleteModal(true);
        }
      })
      .catch((e) => console.log({ e }));
  };

  const approveButton = (
    <Button variant="primary" className="w-100 py-2" onClick={approveContract}>
      <b>Approve Contract</b>
    </Button>
  );

  return (
    <div className="farm white-tp-bg">
      {/* START MODALS */}
      <BlankModal
        show={!!showPendingModal}
        handleClose={() => setShowPendingModal(false)}
        title={"Waiting for Transaction Confirmation ⌛"}
        subtitle={
          "Please confirm this transaction in your wallet and wait here for up to a few minutes for the transaction to confirm..."
        }
        noButton={true}
      />
      <BlankModal
        show={!!showCompleteModal}
        handleClose={() => setShowCompleteModal(false)}
      />
      {/* END MODALS */}

      <div className="title">$Treat</div>
      <div className="body row">
        {/* STAKE */}
        <div className="col-md-4 section">
          <div className="description-container">
            <b className="larger">Balance:</b>
            <br />
            <b>{getDisplayBalance(treatBal)}</b> {title}
          </div>
          <div className="input-container">
            <InputGroup className="mb-3">
              <FormControl
                placeholder="Amount"
                aria-describedby="basic-addon2"
                onChange={(e) => setStakeAmount(e.target.value)}
                value={stakeAmount}
              />
              <Button variant="primary" className="px-4 py-2">
                Max
              </Button>
            </InputGroup>
          </div>
          <div className="button-container">
            {!+hasApproved ? (
              approveButton
            ) : (
              <Button
                variant="primary"
                className="w-100 py-2"
                onClick={() => onStake(stakeAmount)}
              >
                <b>Stake</b>
              </Button>
            )}
          </div>
        </div>

        {/* UNSTAKE */}
        <div className="col-md-4 section">
          <div className="description-container">
            <b className="larger">Staked:</b>
            <br />
            <b>{getDisplayBalance(treatBal)}</b> $Treat
          </div>
          <div className="input-container">
            <InputGroup className="mb-3">
              <FormControl
                placeholder="Amount"
                aria-describedby="basic-addon2"
              />
              <Button variant="primary" className="px-4 py-2">
                Max
              </Button>
            </InputGroup>
          </div>
          <div className="button-container">
            {!+hasApproved ? (
              approveButton
            ) : (
              <Button variant="primary" className="w-100 py-2">
                <b>Unstake</b>
              </Button>
            )}
          </div>
        </div>
        <div className="col-md-4 section purple">
          <div className="description-container mb-3">
            <b className="larger">Unclaimed Rewards:</b>
            <br />
            <b>1027</b> $Treat
          </div>
          <div className="button-container">
            <Button variant="info" className="w-100 py-2">
              <b>Claim Rewards</b>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
  s;
};

export default Farm;
