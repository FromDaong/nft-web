import SwapModal from "@components/Farms/SwapModal";
import {InformationCircleIcon} from "@heroicons/react/outline";
import {useDisclosure} from "@packages/hooks";
import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import {Heading, Text} from "@packages/shared/components/Typography/Headings";
import {ImportantText} from "@packages/shared/components/Typography/Text";
import {ABI} from "@packages/treat/lib/abi";
import {contractAddresses} from "@packages/treat/lib/treat-contracts-constants";
import {useMemo, useState} from "react";
import {useAccount, useBalance, useContract} from "wagmi";
import {useStaking} from "../utils";
import ManageStackModal from "../components/ManageStakeModal";
import {CogIcon, Settings} from "lucide-react";
import {Cog} from "lucide-react";

export default function FarmPortfolioItem({
	name,
	balance,
	id,
	currency,
	logo,
	masterMelonContract,
	pendingMelons,
	pendingMelonsLoading,
	harvestFarm,
}) {
	const {isOpen, onOpen, onClose} = useDisclosure();
	const {stakedAmount, handleStake, handleUnstake, stakedAmountLoading} =
		useStaking(id);

	return (
		<>
			<>
				{isOpen && (
					<ManageStackModal
						isOpen={isOpen}
						onClose={onClose}
						pid={id}
						balance={balance}
					/>
				)}
				<Heading size={"xs"}>{name} Farm</Heading>
				<Container className="flex flex-col gap-2">
					<Heading size={"xss"}>My positions</Heading>

					<Container className="flex flex-col gap-2">
						<Container className="flex justify-between">
							<Text className="flex gap-2 items-center">
								<ImportantText>Staked {currency}</ImportantText>
								<InformationCircleIcon className="w-5 h-5" />
							</Text>
							{stakedAmountLoading && (
								<Container
									css={{
										backgroundColor: "$surface",
									}}
									className="p-3 w-32 rounded"
								/>
							)}
							{!stakedAmountLoading && (
								<Text>
									<ImportantText>
										{" "}
										{Intl.NumberFormat("en-us", {
											currency: "usd",
										}).format(stakedAmount.toNumber())}
									</ImportantText>
								</Text>
							)}
						</Container>
						<Container className="flex justify-between">
							<Text className="flex gap-2 items-center">
								<ImportantText>Balance</ImportantText>
								<InformationCircleIcon className="w-5 h-5" />
							</Text>
							<Text>
								<ImportantText>
									{" "}
									{Intl.NumberFormat("en-us", {
										currency: "usd",
									}).format(balance)}
								</ImportantText>
							</Text>
						</Container>
					</Container>
				</Container>
				<Container className="flex flex-col gap-2">
					<Heading size={"xss"}>My rewards</Heading>

					<Container className="flex flex-col gap-2">
						<Container className="flex justify-between">
							<Text className="flex gap-2 items-center">
								<ImportantText>Pending rewards</ImportantText>
								<InformationCircleIcon className="w-5 h-5" />
							</Text>
							{!pendingMelonsLoading && (
								<Text>
									{" "}
									<ImportantText>
										{" "}
										{Intl.NumberFormat("en-us", {
											currency: "usd",
										}).format(pendingMelons?.toNumber())}
									</ImportantText>
								</Text>
							)}
							{pendingMelonsLoading && (
								<Container
									css={{backgroundColor: "$surface"}}
									className="p-3 w-32"
								/>
							)}
						</Container>
					</Container>
				</Container>
				<Container className="flex justify-between">
					<Container className="flex gap-4">
						<Button
							size={"sm"}
							outlined
							onClick={onOpen}
						>
							<Settings className="w-5 h-5" />
							Manage
						</Button>
					</Container>
					<Button appearance={"accent"}>Harvest rewards</Button>
				</Container>
			</>
		</>
	);
}

export const FarmPortfolioItemSkeleton = () => (
	<Container className="flex items-center justify-between py-2 pr-4 transition-all duration-200 group hover:cursor-pointer rounded-xl hover:bg-zinc-50">
		<Container className="flex items-center gap-4 px-2">
			<Container
				className="w-12 h-12 border p-4 rounded-xl"
				css={{backgroundColor: "$elementOnSurface"}}
			/>
			<Container>
				<Container
					className="rounded p-2 w-32"
					css={{backgroundColor: "$elementOnSurface"}}
				/>
				<Container
					className="rounded p-2 w-20 mt-2"
					css={{backgroundColor: "$elementOnSurface"}}
				/>
			</Container>
		</Container>
		<Container className="flex items-start gap-4 px-2">
			<Container
				className="rounded p-4 w-16"
				css={{backgroundColor: "$elementOnSurface"}}
			/>
		</Container>
	</Container>
);
