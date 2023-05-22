/* eslint-disable no-mixed-spaces-and-tabs */
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
import {Divider} from "@packages/shared/components/Divider";
import StudioNavigation, {
	TabNavigationLink,
} from "@components/CreatorDashboard/StudioNavigation";
import {ArrowRightIcon, SparklesIcon} from "@heroicons/react/outline";
import Link from "next/link";
import {MagnifyingGlassIcon} from "@radix-ui/react-icons";
import {useDisclosure} from "@packages/hooks";
import SwapModal from "@components/Farms/SwapModal";

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
				<Container className="flex flex-col gap-4 px-4 py-4 pt-0 lg:px-0">
					<Container className="flex items-baseline justify-between">
						<StudioNavigation />
					</Container>
				</Container>
				{treatMelonLoading && !treatMelonError && (
					<Container className="flex flex-col items-center justify-center w-full min-h-screen">
						<Spinner />
						<Heading size="xs">Please wait. Loading...</Heading>
					</Container>
				)}
				{!treatMelonLoading && !treatMelonBalance && (
					<Container className="flex flex-col items-center justify-center w-full min-h-screen gap-2 text-center">
						<Heading size="xs">An error occured</Heading>
						<Text>
							Please check your internet connection and reload the page.
						</Text>
					</Container>
				)}
				{!treatMelonLoading && !treatMelonError && treatMelonBalance && (
					<Container className="flex flex-col w-full gap-12 pt-12 mx-auto">
						<Container className="flex flex-col w-full md:flex-row">
							<Container className="flex flex-col gap-1">
								<Heading size="md">
									{!treatMelonLoading
										? ` ${Intl.NumberFormat().format(
												parseInt(treatMelonBalance?.formatted)
										  )}`
										: " Loading..."}{" "}
									<Text>
										<ImportantText>MELON</ImportantText>
									</Text>
								</Heading>
								<Text>
									{Intl.NumberFormat().format(parseInt("673672"))} TREAT
								</Text>
								<Container className="flex gap-4 mt-4">
									<Button>Stake more</Button>
									<Button>Redeem rewards</Button>
								</Container>
							</Container>
						</Container>
						<Container className="grid grid-cols-2 gap-12">
							<Container
								css={{
									backgroundColor: "$surfaceOnSurface",
									borderColor: "$border",
								}}
								className="flex flex-col overflow-hidden divide-y rounded-xl h-fit"
							>
								<Container className="p-4">
									<Heading size={"xss"}>Portfolio</Heading>
								</Container>
								<FarmPortfolioItem
									balance={93783}
									id={1}
									name="Melon"
									currency={"MELON"}
								/>
								<FarmPortfolioItem
									balance={27682}
									id={3}
									name={"TREAT/BNB"}
									currency={"SBNB"}
								/>
								<FarmPortfolioItem
									balance={278738723}
									id={2}
									name="Unclaimed Rewards"
									currency={"MELON"}
								/>
							</Container>
							<Container
								css={{
									backgroundColor: "$surfaceOnSurface",
									borderColor: "$border",
								}}
								className="flex flex-col overflow-hidden divide-y rounded-xl"
							>
								<Container className="flex items-center justify-between p-4">
									<Heading size={"xss"}>Collected melon NFTs</Heading>
									<Container className="flex gap-2">
										<Button appearance={"surface"}>
											<MagnifyingGlassIcon className="w-5 h-5" />
										</Button>
										<Button appearance={"surface"}>
											<SparklesIcon className="w-5 h-5" />
											Mint exclusive NFT
										</Button>
									</Container>
								</Container>
								<Container className="grid grid-cols-3 gap-4 p-4">
									<MelonNFTCard />
									<MelonNFTCard />
									<MelonNFTCard />
								</Container>
							</Container>
						</Container>
					</Container>
				)}
			</ApplicationFrame>
		</ApplicationLayout>
	);
}

interface StakeTreatProps {
	contract: any;
	pid: number;
	treatBalance: {formatted: string};
	treatLpBalance: {formatted: string};
	treatMelonBalance: {formatted: string};
}
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

function FarmPortfolioItem({name, balance, id, currency}) {
	const {isOpen, onOpen, onClose} = useDisclosure();

	return (
		<Container
			onClick={onOpen}
			className="flex items-center justify-between hover:cursor-pointer"
		>
			<SwapModal
				isOpen={isOpen}
				onClose={onClose}
				title={`Swap for ${id}`}
			/>
			<Container className="flex items-center gap-4 p-4">
				<Container
					className="w-12 h-12 rounded-full"
					css={{backgroundColor: "$surfaceOnSurface"}}
				/>
				<Heading size={"xss"}>{name}</Heading>
			</Container>
			<Container className="flex items-center gap-4 p-4">
				<Heading
					size={"xss"}
					className="uppercase"
				>
					{Intl.NumberFormat().format(balance)} {currency}
				</Heading>
			</Container>
		</Container>
	);
}

function MelonNFTCard() {
	return (
		<Container className="flex flex-col gap-4 hover:cursor-pointer">
			<Container
				className="w-full aspect-square"
				css={{background: "$surfaceOnSurface"}}
			/>
			<Container>
				<Heading size={"xss"}>A Happy Puppy</Heading>
				<Text>Claimed 3 minutes ago</Text>
			</Container>
		</Container>
	);
}
