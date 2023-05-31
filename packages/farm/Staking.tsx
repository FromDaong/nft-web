/* eslint-disable no-mixed-spaces-and-tabs */
import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import {Heading} from "@packages/shared/components/Typography/Headings";
import {
	ImportantText,
	SmallText,
	Text,
} from "@packages/shared/components/Typography/Text";
import FarmPortfolioItem, {
	FarmPortfolioItemSkeleton,
} from "./staking/PortfolioItem";
import {useHarvestFarm, useHasApprovedFarm, useStaking} from "./utils";
import {ArrowRight, CopyIcon, Sparkles, Wallet} from "lucide-react";
import {ReactNode, useState} from "react";
import TreatCore from "core/TreatCore";
import axios from "axios";
import {useCopyToClipboard} from "@packages/shared/hooks";
import {contractAddresses} from "@packages/treat/lib/treat-contracts-constants";
import Link from "next/link";
import AssetsOverview from "./components/Assets";

export default function Staking({
	treatMelonBalance,
	treatBalance,
	treatLpBalance,
	address,
	masterMelonContract,
}) {
	const {hasApproved: treatApproved, approve: approveTreat} =
		useHasApprovedFarm(0);
	const {hasApproved: lpApproved, approve: approveLp} = useHasApprovedFarm(1);

	return (
		<Container className="grid grid-cols-1 lg:grid-cols-3 w-full gap-8 self-start">
			<AssetsOverview
				treatApproved={treatApproved}
				approveTreat={approveTreat}
				lpApproved={lpApproved}
				approveLp={approveLp}
				treatBalance={treatBalance?.formatted}
				melonBalance={treatMelonBalance?.formatted}
			/>
			<TreatFarm
				balance={treatBalance?.formatted}
				masterMelonContract={masterMelonContract}
			/>
			<TreatLpFarm
				balance={treatLpBalance?.formatted}
				masterMelonContract={masterMelonContract}
			/>
		</Container>
	);
}

const TreatFarm = ({balance, masterMelonContract}) => {
	const pid = 0;
	const {pendingMelons, pendingMelonsLoading, harvestFarm} =
		useHarvestFarm(pid);

	return (
		<FarmCard>
			<Container className="flex flex-col p-4 overflow-hidden rounded-xl gap-8">
				{!balance || !masterMelonContract ? (
					<>
						<FarmPortfolioItemSkeleton />
					</>
				) : (
					<>
						<FarmPortfolioItem
							balance={balance}
							name="TREAT"
							id={pid}
							currency="TREAT"
							logo={""}
							masterMelonContract={masterMelonContract}
							pendingMelons={pendingMelons}
							pendingMelonsLoading={pendingMelonsLoading}
							harvestFarm={harvestFarm}
						/>
					</>
				)}
			</Container>
		</FarmCard>
	);
};

const TreatLpFarm = ({balance, masterMelonContract}) => {
	const pid = 1;
	const {pendingMelons, pendingMelonsLoading, harvestFarm} =
		useHarvestFarm(pid);

	const bnb_logo_address =
		"https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/smartchain/assets/0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c/logo.png";

	return (
		<FarmCard>
			<Container className="flex flex-col p-4 gap-8 overflow-hidden rounded-xl">
				{!balance || !masterMelonContract ? (
					<>
						<FarmPortfolioItemSkeleton />
					</>
				) : (
					<>
						<FarmPortfolioItem
							balance={balance}
							name="TREAT/BNB"
							id={pid}
							currency="TREAT/BNB"
							logo={bnb_logo_address}
							masterMelonContract={masterMelonContract}
							pendingMelons={pendingMelons}
							pendingMelonsLoading={pendingMelonsLoading}
							harvestFarm={harvestFarm}
						/>
					</>
				)}
			</Container>
		</FarmCard>
	);
};

const FarmCard = ({children}: {children: ReactNode}) => {
	return (
		<Container
			css={{
				backgroundColor: "$elementOnSurface",
				borderColor: "$border",
			}}
			className="flex flex-col rounded-xl h-fit sticky top-[1rem] align-top "
		>
			{children}
		</Container>
	);
};
