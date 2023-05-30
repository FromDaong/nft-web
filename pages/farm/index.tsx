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
import Staking from "@packages/farm/Staking";

// T-78 Use intersection observer to change navbar color.

export default function Farm() {
	const {address} = useAccount();
	const {data: treatMelonBalance, isLoading: treatMelonLoading} = useBalance({
		token: contractAddresses.melonToken[56],
		addressOrName: address,
	});

	const {data: treatLpBalance} = useBalance({
		token: contractAddresses.treatPancakeLP[56],
		addressOrName: address,
	});

	const {data: treatBalance, isError: treatError} = useBalance({
		token: contractAddresses.treatToken[56],
		addressOrName: address,
	});

	const masterMelonContract = useContract({
		addressOrName: contractAddresses.masterMelonFarmer[56],
		contractInterface: ABI.masterMelonFarmer,
	});

	return (
		<ApplicationLayout>
			<ApplicationFrame>
				<Container
					className="flex flex-col gap-4 overflow-x-auto border-b lg:px-0"
					css={{borderColor: "$border"}}
				>
					<Container className="flex items-baseline justify-between">
						<StudioNavigation />
					</Container>
				</Container>
				{treatMelonLoading && (
					<Container className="flex flex-col items-center justify-center w-full min-h-screen">
						<Spinner />
						<Heading size="xs">Please wait. Loading...</Heading>
					</Container>
				)}
				{treatError && (
					<Container className="flex flex-col items-center justify-center w-full min-h-screen gap-2 text-center">
						<Heading size="xs">An error occured</Heading>
						<Text>
							Please check your internet connection and reload the page.
						</Text>
					</Container>
				)}
				<Container className="flex flex-wrap w-full gap-12 pt-12 mx-auto">
					<Container className="grid flex-1 grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
						<Heading size={"xss"}>Available Melon NFTs</Heading>
					</Container>
					<Staking
						treatMelonLoading={treatMelonLoading}
						parseInt={parseInt}
						treatMelonBalance={treatMelonBalance}
						treatLpBalance={treatLpBalance}
						address={address}
						treatBalance={treatBalance}
						masterMelonContract={masterMelonContract}
					/>
				</Container>
			</ApplicationFrame>
		</ApplicationLayout>
	);
}
