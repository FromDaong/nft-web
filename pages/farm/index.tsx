import ApplicationLayout from "core/components/layouts/ApplicationLayout";
import ApplicationFrame from "core/components/layouts/ApplicationFrame";
import {useAccount, useBalance} from "wagmi";
import {contractAddresses} from "@packages/treat/lib/constants";
import {Container} from "@packages/shared/components/Container";
import {Heading, Text} from "@packages/shared/components/Typography/Headings";
import {
	ImportantText,
	MutedText,
	SmallText,
} from "@packages/shared/components/Typography/Text";
import {Button} from "@packages/shared/components/Button";

// T-78 Use intersection observer to change navbar color.

export default function Farm() {
	return (
		<ApplicationLayout>
			<ApplicationFrame>
				<Container className="flex flex-col max-w-screen-lg gap-12 pt-12 mx-auto">
					<Container className="flex flex-col gap-2">
						<Heading size="md">Farm Dashboard</Heading>
						<Text>
							Stake $Treat to earn $Melon. Exchange $Melon at the Farmers'
							Market to get exclusive NFTs.
						</Text>
						<Heading
							size="xs"
							css={{
								color: "$teal10",
							}}
						>
							🍈 Melon balance: 10.000
						</Heading>
					</Container>
					<StakeTreat />
					<StakeTreatBNB />
				</Container>
			</ApplicationFrame>
		</ApplicationLayout>
	);
}

function StakeTreat() {
	const {address} = useAccount();
	const {
		data: treatBalance,
		isError,
		isLoading,
	} = useBalance({
		token: contractAddresses.treat2[56],
		addressOrName: address,
	});

	const {
		data: treatMelonBalance,
		isError: treatMelonError,
		isLoading: treatMelonLoading,
	} = useBalance({
		token: contractAddresses.melon[56],
		addressOrName: address,
	});
	return (
		<Container
			className="flex flex-col gap-4 p-4 rounded-xl"
			css={{
				background: "$elementOnSurface",
			}}
		>
			<Container className="w-full py-4 text-center">
				<Heading size={"xs"}>Stake $Treat</Heading>
			</Container>
			<Container className="grid grid-cols-1 gap-4 md:grid-cols-2">
				<Container
					className="flex flex-col col-span-1 gap-2 p-4 rounded-xl"
					css={{
						background: "$surfaceOnSurface",
					}}
				>
					<SmallText>
						<ImportantText>$Treat</ImportantText>
					</SmallText>
					<Container className="flex justify-between">
						<input
							className="text-2xl font-bold bg-transparent placeholder:text-inherit"
							placeholder="0.00"
						/>
						<Button appearance={"action"}>Max</Button>
					</Container>
					<Container className="flex gap-1">
						<MutedText>Balance:</MutedText>
						<Text>
							<ImportantText>
								{Number(treatBalance?.formatted ?? 0).toFixed(5)}
							</ImportantText>
						</Text>
					</Container>
					<Container className="mt-4">
						<Button fullWidth>Stake</Button>
					</Container>
				</Container>
				<Container
					className="flex flex-col col-span-1 gap-2 p-4 rounded-xl"
					css={{
						background: "$surfaceOnSurface",
					}}
				>
					<SmallText>
						<ImportantText>Staked $Treat</ImportantText>
					</SmallText>
					<Container className="flex justify-between">
						<input
							className="text-2xl font-bold bg-transparent placeholder:text-inherit"
							placeholder="0.00"
						/>
						<Button appearance={"action"}>Max</Button>
					</Container>
					<Container className="flex gap-1">
						<MutedText>Balance:</MutedText>
						<Text>
							<ImportantText>0.00</ImportantText>
						</Text>
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
						0.000 $Melon
					</Heading>
				</Container>
				<Container className="w-full">
					<Button
						fullWidth
						appearance={"accent"}
					>
						Claim $Melon rewards
					</Button>
				</Container>
			</Container>
		</Container>
	);
}

function StakeTreatBNB() {
	const {address} = useAccount();
	const {
		data: treatLpBalance,
		isError: treatLpError,
		isLoading: treatLpLoading,
	} = useBalance({
		token: contractAddresses.treatPancakeLP[56],
		addressOrName: address,
	});

	const {
		data: treatMelonBalance,
		isError: treatMelonError,
		isLoading: treatMelonLoading,
	} = useBalance({
		token: contractAddresses.melon[56],
		addressOrName: address,
	});
	return (
		<Container
			className="flex flex-col gap-4 p-4 rounded-xl"
			css={{
				background: "$elementOnSurface",
			}}
		>
			<Container className="w-full py-4 text-center">
				<Heading size={"xs"}>Stake $Treat/BNB</Heading>
			</Container>
			<Container className="grid grid-cols-1 gap-4 md:grid-cols-2">
				<Container
					className="flex flex-col col-span-1 gap-2 p-4 rounded-xl"
					css={{
						background: "$surfaceOnSurface",
					}}
				>
					<SmallText>
						<ImportantText>$Treat/BNB</ImportantText>
					</SmallText>
					<Container className="flex justify-between">
						<input
							className="text-2xl font-bold bg-transparent placeholder:text-inherit"
							placeholder="0.00"
						/>
						<Button appearance={"action"}>Max</Button>
					</Container>
					<Container className="flex gap-1">
						<MutedText>Balance:</MutedText>
						<Text>
							<ImportantText>
								{Number(treatLpBalance?.formatted ?? 0).toFixed(5)}
							</ImportantText>
						</Text>
					</Container>
					<Container className="mt-4">
						<Button fullWidth>Stake</Button>
					</Container>
				</Container>
				<Container
					className="flex flex-col col-span-1 gap-2 p-4 rounded-xl"
					css={{
						background: "$surfaceOnSurface",
					}}
				>
					<SmallText>
						<ImportantText>Staked $Treat/BNB</ImportantText>
					</SmallText>
					<Container className="flex justify-between">
						<input
							className="text-2xl font-bold bg-transparent placeholder:text-inherit"
							placeholder="0.00"
						/>
						<Button appearance={"action"}>Max</Button>
					</Container>
					<Container className="flex gap-1">
						<MutedText>Balance:</MutedText>
						<Text>
							<ImportantText>0.00</ImportantText>
						</Text>
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
						0.000 $Melon
					</Heading>
				</Container>
				<Container className="w-full">
					<Button
						fullWidth
						appearance={"accent"}
					>
						Claim $Melon rewards
					</Button>
				</Container>
			</Container>
		</Container>
	);
}
