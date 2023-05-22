/* eslint-disable no-mixed-spaces-and-tabs */
import StudioNavigation from "@components/CreatorDashboard/StudioNavigation";
import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import {Heading} from "@packages/shared/components/Typography/Headings";
import {ImportantText, Text} from "@packages/shared/components/Typography/Text";
import Spinner from "@packages/shared/icons/Spinner";
import {ABI} from "@packages/treat/lib/abi";
import {contractAddresses} from "@packages/treat/lib/treat-contracts-constants";
import Link from "next/link";
import {ReactNode} from "react";
import {useAccount, useBalance, useContract} from "wagmi";

export default function FarmLayout({children}: {children?: ReactNode}) {
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
		<>
			<Container className="py-4 md:pt-0 px-4 lg:px-0 flex flex-col gap-4">
				<Container className="flex justify-between items-baseline">
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
				<Container className="flex flex-col gap-12 pt-12 mx-auto w-full">
					<Container className="flex flex-col w-full  md:flex-row">
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
							<Container className="mt-4 flex gap-4">
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
							className="rounded-xl flex flex-col divide-y"
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
								balance={278738723}
								id={2}
								name="TREAT"
								currency={"TREAT"}
							/>
							<FarmPortfolioItem
								balance={27682}
								id={3}
								name={"Staked BNB"}
								currency={"SBNB"}
							/>
							<FarmPortfolioItem
								balance={283}
								id={4}
								name="BNB"
								currency={"BNB"}
							/>
						</Container>
						{children && (
							<Container
								css={{
									backgroundColor: "$surfaceOnSurface",
									borderColor: "$border",
								}}
								className="rounded-xl flex flex-col divide-y"
							>
								{children}
							</Container>
						)}
					</Container>
				</Container>
			)}
		</>
	);
}

function FarmPortfolioItem({name, balance, id, currency}) {
	return (
		<Link href={`/farm/${id}`}>
			<a>
				<Container className="flex justify-between items-center">
					<Container className="flex gap-4 items-center p-4">
						<Container className="w-12 h-12 rounded-full bg-zinc-100" />
						<Heading size={"xss"}>{name}</Heading>
					</Container>
					<Container className="flex gap-4 p-4 items-center">
						<Heading
							size={"xss"}
							className="uppercase"
						>
							{Intl.NumberFormat().format(balance)} {currency}
						</Heading>
					</Container>
				</Container>
			</a>
		</Link>
	);
}
