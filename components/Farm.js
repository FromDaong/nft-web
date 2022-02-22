import React, { useState } from "react";
import { InputGroup, FormControl, Button } from "react-bootstrap";
import BlankModal from "../components/BlankModal";
import { getDisplayBalance, getBalanceNumber } from "../utils/formatBalance";
import useGetPendingMelons from "../hooks/useGetPendingMelons";
import hasApprovedContract from "../hooks/hasApprovedContract";
import useApproveContract from "../hooks/approveContract";
import useGetStakedAmount from "../hooks/useGetStakedAmount";
import useStakeFarms from "../hooks/useStakeFarms";
import useHarvestFarms from "../hooks/useHarvestFarm";
import useUnstakeFarms from "../hooks/useUnstakeFarms";
import BigNumber from "bignumber.js";

const Farm = ({ contract, treatBal, title, pid }) => {
  const hasApproved = contract && hasApprovedContract(pid);
  const { onReward } = contract && useHarvestFarms(pid);
  const { onApprove } = contract && useApproveContract(pid);
  const { onStake } = contract && useStakeFarms(pid);
  const { onUnstake: onV1Unstake } = contract && useUnstakeFarms(pid, true);
  const { onUnstake } = contract && useUnstakeFarms(pid);
  const pendingMelons = useGetPendingMelons(pid);
  const v1StakedAmount = useGetStakedAmount(pid, true);
  const stakedAmount = useGetStakedAmount(pid) || 0;
  const [showPendingModal, setShowPendingModal] = useState(null);
  const [showCompleteModal, setShowCompleteModal] = useState(null);
  const [unstakeAmount, setUnstakeAmount] = useState(0);
  const [stakeAmount, setStakeAmount] = useState(0);

  const formattedV1StakedAmount =
    v1StakedAmount && getBalanceNumber(v1StakedAmount);

  

  const approveContract = () => {
    setShowPendingModal(true);
    onApprove()
      .then((s) => {
        setShowPendingModal(false);
        if (s) {
          setShowCompleteModal(true);
        }
      })
      .catch((e) => console.error({ e }));
  };

  const actionWithModal = (action, param) => {
    setShowPendingModal(true);
    action(param)
      .then(() => {
        setShowPendingModal(false);
        setShowCompleteModal(true);
      })
      .catch((e) => console.error({ e }));
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
      <div className="title">
        Stake {title}
        {!!formattedV1StakedAmount && (
          <div className="small">
            Please unstake and restake your {title} to use our improved staking
            contract.
          </div>
        )}
      </div>
      <div className="body row">
        {/* STAKE */}

        <div className="col-md-4 section">
          {!formattedV1StakedAmount ? (
            <>
              <div className="description-container">
                <b className="larger">Balance:</b>
                <br />
                <b>{getDisplayBalance(treatBal)}</b> {title}
              </div>
              <div className="input-container">
                <InputGroup className="mb-3">
                  <FormControl
                    placeholder="Amount"
                    type="number"
                    aria-describedby="basic-addon2"
                    onChange={(e) => setStakeAmount(e.target.value)}
                    value={stakeAmount}
                  />
                  <Button
                    variant="primary"
                    className="px-4 py-2"
                    onClick={(e) => setStakeAmount(getBalanceNumber(treatBal))}
                  >
                    <b>Max</b>
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
                    onClick={() => actionWithModal(onStake, stakeAmount)}
                  >
                    <b>Stake</b>
                  </Button>
                )}
              </div>
            </>
          ) : null}
        </div>

        {/* UNSTAKE */}
        <div className="col-md-4 section">
          <div className="description-container">
            <b className="larger">Staked:</b>
            <br />
            <b>
              {stakedAmount &&
                (formattedV1StakedAmount || getDisplayBalance(stakedAmount))}
            </b>{" "}
            {title}
          </div>
          <div className="input-container">
            <InputGroup className="mb-3">
              <FormControl
                placeholder="Amount"
                type="number"
                aria-describedby="basic-addon2"
                onChange={(e) => setUnstakeAmount(e.target.value)}
                value={unstakeAmount}
              />
              <Button
                variant="primary"
                className="px-4 py-2"
                onClick={() =>
                  setUnstakeAmount(
                    formattedV1StakedAmount || getBalanceNumber(stakedAmount)
                  )
                }
              >
                <b>Max</b>
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
                onClick={() =>
                  actionWithModal(
                    formattedV1StakedAmount ? onV1Unstake : onUnstake,
                    unstakeAmount
                  )
                }
              >
                <b>Unstake</b>
              </Button>
            )}
          </div>
        </div>

        <div className="col-md-4 section purple">
          {!formattedV1StakedAmount ? (
            <>
              <div className="description-container mb-3">
                <b className="larger">Unclaimed Rewards:</b>
                <br />
                <b>{pendingMelons && getDisplayBalance(pendingMelons)}</b>{" "}
                $Melon
              </div>
              <div className="button-container">
                <Button
                  variant="info"
                  className="w-100 py-2"
                  onClick={() => actionWithModal(onReward, stakeAmount)}
                >
                  <b>Claim $Melon Rewards</b>
                </Button>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
  s;
};

export default Farm;
