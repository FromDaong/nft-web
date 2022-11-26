import useApproveContract from "@hooks/approveContract";
import useGetPendingMelons from "@hooks/useGetPendingMelons";
import useGetStakedAmount from "@hooks/useGetStakedAmount";
import useStakeFarms from "@hooks/useStakeFarms";
import useUnstakeFarms from "@hooks/useUnstakeFarms";
import { Input } from "@packages/form";
import { Button } from "@packages/shared/components/Button";
import { Container } from "@packages/shared/components/Container";
import {
  Heading,
  ImportantSmallText,
  Text,
} from "@packages/shared/components/Typography/Headings";
import { hasApprovedContract } from "@packages/treat/utils";
import { useState } from "react";

export default function StakeTreat({ contract, treatBal, title, pid }) {
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

  return (
    <Container
      css={{ border: "1px solid $subtleBorder", borderRadius: "16px" }}
      className="w-full p-8 gap-8 flex flex-col"
    >
      <Container className="flex justify-center">
        <Heading size="sm">Stake $TREAT</Heading>
      </Container>
      <Container className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ">
        <Container className="col-span-1 h-auto">
          <Container className="mb-6">
            <Heading size="xs">Balance</Heading>
            <Text>
              <ImportantSmallText>0.000</ImportantSmallText>
              $Treat
            </Text>
          </Container>
          <Container>
            <form>
              <Input className="px-2 py-1 px-4 py-3 mb-2" value={0} />
            </form>
          </Container>
          <Button appearance={"surface"}>Approve Contract</Button>
        </Container>
        <Container className="col-span-1 h-auto">
          <Container className="mb-6">
            <Heading size="xs">Staked</Heading>
            <Text>
              <ImportantSmallText>0.000</ImportantSmallText>
              Treat
            </Text>
          </Container>
          <Container>
            <form>
              <Input className="px-4 py-3 mb-2" value={0} />
            </form>
          </Container>
          <Button appearance={"surface"}>Approve Contract</Button>
        </Container>
        <Container className="col-span-1 h-auto md:col-span-2 lg:col-span-1 md:flex flex-col items-center justify-between">
          <Container className="mb-6">
            <Heading size="xs">Unclaimed Rewards</Heading>
            <Text>
              <ImportantSmallText>0.000</ImportantSmallText>
              Melon
            </Text>
          </Container>
          <Button>Claim $Melon Rewards</Button>
        </Container>
      </Container>
    </Container>
  );
}
