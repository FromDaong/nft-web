import SwapModal from "@components/Farms/SwapModal";
import useApproveContract from "@packages/chain/hooks/approveContract";
import useGetPendingMelons from "@packages/chain/hooks/useGetPendingMelons";
import useGetStakedAmount from "@packages/chain/hooks/useGetStakedAmount";
import useStakeFarms from "@packages/chain/hooks/useStakeFarms";
import useUnstakeFarms from "@packages/chain/hooks/useUnstakeFarms";
import {useDisclosure} from "@packages/hooks";
import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import {
	Heading,
	SmallText,
} from "@packages/shared/components/Typography/Headings";
import {
	ImportantText,
	MutedText,
	Text,
} from "@packages/shared/components/Typography/Text";
import Spinner from "@packages/shared/icons/Spinner";
import {ABI} from "@packages/treat/lib/abi";
import {contractAddresses} from "@packages/treat/lib/treat-contracts-constants";
import {useCallback, useMemo, useState} from "react";
import {useAccount, useContract} from "wagmi";

interface StakeTreatProps {
	contract: any;
	pid: number;
	treatBalance: {formatted: string};
	treatLpBalance: {formatted: string};
	treatMelonBalance: {formatted: string};
}

const hasApprovedTreatStaking = async (treatContract, address) => {
	return treatContract.allowance(
		address,
		contractAddresses.masterMelonFarmer[56]
	);
};

const hasApprovedTreatPancakeLPStaking = async (
	treatPancakeLPContract,
	address
) => {
	return treatPancakeLPContract.allowance(
		address,
		contractAddresses.treatPancakeLP[56]
	);
};

const hasApprovedStaking = (pid = 0, contract, address) => {
	if (pid === 0) {
		return hasApprovedTreatStaking(contract, address);
	}

	return hasApprovedTreatPancakeLPStaking(contract, address);
};

const StakeTreat: React.FC<StakeTreatProps> = ({
	contract: masterMelonContract,
	pid,
	treatBalance,
	treatLpBalance,
	treatMelonBalance,
}) => {
	const pools = ["$Treat", "$Treat/BNB"];
	const balances = [treatBalance, treatLpBalance];
	const lPBalance = balances[pid];
	const [unstakeAmount, setUnstakeAmount] = useState<number>(0);
	const [stakeAmount, setStakeAmount] = useState<number>(0);
	const {address} = useAccount();
	const treatContract = useContract({
		addressOrName: contractAddresses.treatToken[56],
		contractInterface: ABI.treat,
	});
	const hasApproved = useMemo(
		() => hasApprovedStaking(pid, treatContract, address),
		[pid, treatContract, address]
	);
	const {handleHarvest} = useHarvestFarms(pid, masterMelonContract);
	// change 2nd arg to treatLpContract
	const {onApprove} = useApproveContract(
		pid,
		treatContract,
		treatContract,
		masterMelonContract
	);
	const {onStake} = useStakeFarms(pid, masterMelonContract);
	const {onUnstake: onV1Unstake} = useUnstakeFarms(
		pid,
		true,
		masterMelonContract,
		masterMelonContract
	);
	const {onUnstake} = useUnstakeFarms(
		pid,
		false,
		masterMelonContract,
		masterMelonContract
	);
	const pendingMelons = useGetPendingMelons(pid, masterMelonContract);
	const v1StakedAmount = useGetStakedAmount(
		pid,
		true,
		masterMelonContract,
		masterMelonContract
	);
	const stakedAmount =
		useGetStakedAmount(pid, false, masterMelonContract, masterMelonContract) ||
		0;
	return (
		<Container
			className="flex flex-col gap-4 p-4 border shadow-sm rounded-xl"
			css={{
				background: "$surfaceOnSurface",
				borderColor: "$border",
			}}
		>
			<Container className="w-full py-4">
				<Heading size={"xs"}>Stake {pools[pid]}</Heading>
			</Container>
			<Container className="grid grid-cols-1 gap-4 md:grid-cols-2">
				<Container
					className="flex flex-col col-span-1 gap-2 p-4 rounded-xl"
					css={{
						background: "$surface",
						borderColor: "$border",
					}}
				>
					{
						// TREAT Balance
					}
					<SmallText>
						<ImportantText>{pools[pid]}</ImportantText>
					</SmallText>
					<Container className="flex justify-between">
						<input
							className="text-2xl font-bold bg-transparent placeholder:text-inherit"
							placeholder="0.00"
						/>
						<Button appearance={"action"}>Max</Button>
					</Container>
					<Container className="flex items-center gap-2">
						<MutedText>Balance:</MutedText>
						<Text>
							{treatBalance && (
								<Text css={{color: "$textContrast"}}>
									<ImportantText>
										{Number(treatBalance.formatted ?? 0).toFixed(5)}
									</ImportantText>
								</Text>
							)}
							{!treatBalance && <Spinner />}
						</Text>
					</Container>
					<Container className="mt-4">
						{treatBalance && (
							<Button
								disabled={!Number(treatBalance.formatted)}
								fullWidth
							>
								Stake
							</Button>
						)}
						{!treatBalance && (
							<Button
								fullWidth
								appearance={"disabled"}
								disabled
							>
								<Spinner />
							</Button>
						)}
					</Container>
				</Container>
				<Container
					className="flex flex-col col-span-1 gap-2 p-4 rounded-xl"
					css={{
						background: "$surface",
						borderColor: "$border",
					}}
				>
					{
						// Staked Balance
					}
					<SmallText>
						<ImportantText>Staked {pools[pid]}</ImportantText>
					</SmallText>
					<Container className="flex justify-between">
						<input
							className="text-2xl font-bold bg-transparent placeholder:text-inherit"
							placeholder="0.00"
						/>
						<Button appearance={"action"}>Max</Button>
					</Container>
					<Container className="flex items-center gap-2">
						<MutedText>Balance:</MutedText>
						{balances[pid] && (
							<Text css={{color: "$textContrast"}}>
								<ImportantText>
									{Number(balances[pid].formatted ?? 0).toFixed(5)}
								</ImportantText>
							</Text>
						)}
						{!balances[pid] && <Spinner />}
					</Container>
					<Container className="mt-4">
						<Button fullWidth>Unstake</Button>
					</Container>
				</Container>
			</Container>
			<Container
				className="flex flex-col gap-8 p-4 rounded-xl"
				css={{
					background: "$surfaceOnSurface",
				}}
			>
				<Container className="flex flex-col gap-2">
					<SmallText>
						<ImportantText
							css={{
								color: "$mint11",
							}}
						>
							UNCLAIMED REWARDS
						</ImportantText>
					</SmallText>
					<Heading
						size="sm"
						css={{
							color: "$mint11",
						}}
					>
						{pendingMelons === null && <Spinner />}
						{pendingMelons && Intl.NumberFormat().format(pendingMelons)} $Melon
					</Heading>
				</Container>
				<Container className="w-full">
					<Button
						fullWidth
						appearance={!pendingMelons ? "disabled" : "accent"}
						disabled={!pendingMelons}
					>
						Claim $Melon rewards
					</Button>
				</Container>
			</Container>
		</Container>
	);
};
