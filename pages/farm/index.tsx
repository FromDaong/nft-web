import ApplicationLayout from "core/components/layouts/ApplicationLayout";
import ApplicationFrame from "core/components/layouts/ApplicationFrame";
import {useAccount, useBalance, useContract} from "wagmi";
import {contractAddresses} from "@packages/treat/lib/treat-contracts-constants";
import {Container} from "@packages/shared/components/Container";
import {Heading, Text} from "@packages/shared/components/Typography/Headings";
import {
	ImportantText,
	MutedText,
	SmallText,
} from "@packages/shared/components/Typography/Text";
import {Button} from "@packages/shared/components/Button";
import {ABI} from "@packages/treat/lib/abi";
import {useCallback, useMemo, useState} from "react";
import useApproveContract from "@packages/chain/hooks/approveContract";
import useStakeFarms from "@packages/chain/hooks/useStakeFarms";
import useUnstakeFarms from "@packages/chain/hooks/useUnstakeFarms";
import useGetPendingMelons from "@packages/chain/hooks/useGetPendingMelons";
import useGetStakedAmount from "@packages/chain/hooks/useGetStakedAmount";
import Spinner from "@packages/shared/icons/Spinner";

// T-78 Use intersection observer to change navbar color.

export default function Farm() {
	const {address} = useAccount();
	const {
		data: treatMelonBalance,
		isError: treatMelonError,
		isLoading: treatMelonLoading,
	} = useBalance({
		token: contractAddresses.melonToken[56],
		addressOrName: address,
	});

	const {
		data: treatLpBalance,
		isError: treatLpError,
		isLoading: treatLpLoading,
	} = useBalance({
		token: contractAddresses.treatPancakeLP[56],
		addressOrName: address,
	});

	const masterMelonContract = useContract({
		addressOrName: contractAddresses.masterMelonFarmer[56],
		contractInterface: ABI.masterMelonFarmer,
	});

	return (
		<ApplicationLayout>
			<ApplicationFrame>
				{treatMelonLoading && !treatMelonError && (
					<Container className="w-full min-h-screen flex flex-col items-center justify-center">
						<Spinner />
						<Heading size="xs">Please wait. Loading...</Heading>
					</Container>
				)}
				{!treatMelonLoading && !treatMelonBalance && (
					<Container className="w-full min-h-screen gap-2 flex flex-col items-center justify-center text-center">
						<Heading size="xs">An error occured</Heading>
						<Text>
							Please check your internet connection and reload the page.
						</Text>
					</Container>
				)}
				{(!treatMelonLoading && !treatMelonError && treatMelonBalance) ||
					(true && (
						<Container className="flex flex-col max-w-screen-lg gap-12 pt-12 mx-auto">
							<Container className="flex flex-col gap-2">
								<Heading size="md">Farm Dashboard</Heading>
								<Text>
									Stake $Treat to earn $Melon. Exchange $Melon at the Farmers'
									Market to get exclusive NFTs.
								</Text>
								<Heading
									size="xss"
									css={{
										color: "$teal10",
									}}
								>
									🍈 Melon balance:
									{!treatMelonLoading
										? ` ${treatMelonBalance?.formatted}`
										: " Loading..."}
								</Heading>
							</Container>
							<StakeTreat
								pid={0}
								contract={masterMelonContract}
								treatBalance={treatMelonBalance}
								treatLpBalance={treatLpBalance}
								treatMelonBalance={treatMelonBalance}
							/>
							<StakeTreat
								pid={1}
								contract={masterMelonContract}
								treatBalance={treatMelonBalance}
								treatLpBalance={treatLpBalance}
								treatMelonBalance={treatMelonBalance}
							/>
						</Container>
					))}
			</ApplicationFrame>
		</ApplicationLayout>
	);
}

function StakeTreat({
	contract: masterMelonContract,
	pid,
	treatBalance,
	treatLpBalance,
	treatMelonBalance,
}: {
	contract: any;
	pid: number;
	treatBalance: {
		formatted: string;
	};
	treatLpBalance: {
		formatted: string;
	};
	treatMelonBalance: {
		formatted: string;
	};
}) {
	const pools = ["$Treat", "$Treat/BNB"];
	const balances = [treatBalance, treatLpBalance];
	const lPBalance = balances[pid];
	const [unstakeAmount, setUnstakeAmount] = useState(0);
	const [stakeAmount, setStakeAmount] = useState(0);

	const {address} = useAccount();
	const treatContract = useContract({
		addressOrName: contractAddresses.treatToken[56],
		contractInterface: ABI.treat,
	});

	const hasApproved = useMemo(
		() => hasApprovedStaking(pid, treatContract, address),
		[]
	);
	const {handleHarvest} =
		masterMelonContract && useHarvestFarms(pid, masterMelonContract);
	// change 2nd arg to treatLpContract
	const {onApprove} =
		masterMelonContract &&
		useApproveContract(pid, treatContract, treatContract, masterMelonContract);
	const {onStake} =
		masterMelonContract && useStakeFarms(pid, masterMelonContract);
	const {onUnstake: onV1Unstake} =
		masterMelonContract &&
		useUnstakeFarms(pid, true, masterMelonContract, masterMelonContract);
	const {onUnstake} =
		masterMelonContract &&
		useUnstakeFarms(pid, false, masterMelonContract, masterMelonContract);
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
			className="flex flex-col gap-4 p-4 rounded-xl"
			css={{
				background: "$elementOnSurface",
			}}
		>
			<Container className="w-full py-4 text-center">
				<Heading size={"xs"}>Stake {pools[pid]}</Heading>
			</Container>
			<Container className="grid grid-cols-1 gap-4 md:grid-cols-2">
				<Container
					className="flex flex-col col-span-1 gap-2 p-4 rounded-xl"
					css={{
						background: "$surfaceOnSurface",
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
					<Container className="flex gap-2 items-center">
						<MutedText>Balance:</MutedText>
						<Text>
							{treatBalance && (
								<ImportantText>
									{Number(treatBalance.formatted ?? 0).toFixed(5)}
								</ImportantText>
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
						background: "$surfaceOnSurface",
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
					<Container className="flex gap-2 items-center">
						<MutedText>Balance:</MutedText>
						{balances[pid] && (
							<ImportantText>
								{Number(balances[pid].formatted ?? 0).toFixed(5)}
							</ImportantText>
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
					<Heading
						size="xss"
						css={{
							color: "$accentText",
						}}
					>
						Unclaimed Rewards
					</Heading>
					<Heading
						size="sm"
						css={{
							color: "$accentText",
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

const harvestFarm = async (masterMelonFarmerContract, pid, address) => {
	if (pid === 0) {
		const tx = await masterMelonFarmerContract.leaveStaking("0", {
			from: address,
		});

		return tx;
	}

	const tx = await masterMelonFarmerContract.deposit(pid, "0", {from: address});

	return tx;
};

const useHarvestFarms = (farmPID: number, masterMelonFarmerContract) => {
	const {address} = useAccount();

	const handleHarvest = useCallback(async () => {
		await harvestFarm(masterMelonFarmerContract, farmPID, address);
	}, [address, farmPID, masterMelonFarmerContract]);

	return {
		handleHarvest,
	};
};
