import ApplicationLayout from "core/components/layouts/ApplicationLayout";
import ApplicationFrame from "core/components/layouts/ApplicationFrame";
import {useAccount, useBalance} from "wagmi";
import {contractAddresses} from "@packages/treat/lib/constants";
import {Container} from "@packages/shared/components/Container";
import {Heading, Text} from "@packages/shared/components/Typography/Headings";
import {Button} from "@packages/shared/components/Button";
import {Input} from "@packages/shared/components/Input";
import {MutedText} from "@packages/shared/components/Typography/Text";

// TODO: Use intersection observer to change navbar color.

export default function Farm() {
	const {address} = useAccount();
	const {
		data: treatBalance,
		isError,
		isLoading,
	} = useBalance({
		token: contractAddresses.treat2["0x38"],
		addressOrName: address,
	});

	const {
		data: treatLpBalance,
		isError: treatLpError,
		isLoading: treatLpLoading,
	} = useBalance({
		token: contractAddresses.treatPancakeLP["0x38"],
		addressOrName: address,
	});

	const {
		data: treatMelonBalance,
		isError: treatMelonError,
		isLoading: treatMelonLoading,
	} = useBalance({
		token: contractAddresses.melon["0x38"],
		addressOrName: address,
	});

	console.log({treatBalance, treatLpBalance, treatMelonBalance});

	return (
		<ApplicationLayout>
			<ApplicationFrame>
				<Container className="flex flex-col gap-12 pt-12">
					<Container>
						<Heading size="md">Farm Dashboard</Heading>
						<Text>
							Stake $Treat to earn $Melon. Exchange $Melon at the Farmers'
							Market to get exclusive NFTs.
						</Text>
					</Container>
					<Container className="flex flex-col gap-8">
						<Container className="flex items-center justify-between">
							<Heading size="xs">
								{!treatMelonLoading &&
									!treatMelonError &&
									`🍈 $Melon Balance: ${treatMelonBalance.formatted}`}
							</Heading>
							<Button
								css={{backgroundColor: "$teal9", color: "$elementSurface"}}
							>
								Go to farmer's market
							</Button>
						</Container>
						<Container
							className="flex flex-col gap-8 p-8 border shadow"
							css={{borderColor: "$subtleBorder", borderRadius: "16px"}}
						>
							<Container className="flex justify-center w-full">
								<Heading size="md">Stake $TREAT</Heading>
							</Container>
							<Container className="grid grid-cols-3 gap-8">
								{!isError && !isLoading && (
									<StakingFieldItem
										balance={treatBalance.formatted}
										currency={treatBalance.symbol}
										title={"Balance"}
										actionText={"Approve contract"}
									/>
								)}
								{!isError && !isLoading && (
									<StakingFieldItem
										balance={treatBalance.formatted}
										currency={treatBalance.symbol}
										title={"Staked"}
										actionText={"Approve contract"}
									/>
								)}
								{!isError && !isLoading && (
									<StakingFieldItem
										balance={treatMelonBalance.formatted}
										currency={treatMelonBalance.symbol}
										title={"Unclaimed Rewards"}
										actionText={"Claim $Melon Rewards"}
										noInput
									/>
								)}
							</Container>
						</Container>
					</Container>
					<Container
						className="flex flex-col gap-8 p-8 border shadow"
						css={{borderColor: "$subtleBorder", borderRadius: "16px"}}
					>
						<Container className="flex justify-center w-full">
							<Heading size="md">Stake $TREAT/BNB</Heading>
						</Container>
						<Container className="grid grid-cols-3 gap-8">
							{!treatLpError && !treatLpLoading && (
								<StakingFieldItem
									balance={treatLpBalance.formatted}
									currency={treatLpBalance.symbol}
									title={"Balance"}
									actionText={"Approve contract"}
								/>
							)}
							{!isError && !isLoading && (
								<StakingFieldItem
									balance={treatBalance.formatted}
									currency={treatBalance.symbol}
									title={"Staked"}
									actionText={"Approve contract"}
								/>
							)}
							{!isError && !isLoading && (
								<StakingFieldItem
									balance={treatMelonBalance.formatted}
									currency={treatMelonBalance.symbol}
									title={"Unclaimed Rewards"}
									actionText={"Claim $Melon Rewards"}
									noInput
								/>
							)}
						</Container>
					</Container>
				</Container>
			</ApplicationFrame>
		</ApplicationLayout>
	);
}

const StakingFieldItem = ({
	balance,
	currency,
	noInput,
	title,
	actionText,
}: {
	balance: string;
	currency: string;
	noInput?: boolean;
	actionText: string;
	title: string;
}) => {
	return (
		<Container className="flex flex-col justify-between h-auto gap-6">
			<Container className="flex flex-col items-center w-full gap-4">
				<Heading size="xs">
					<MutedText>{title}</MutedText>
				</Heading>
				<Heading size="sm">
					{`${balance}`} ${currency}
				</Heading>
			</Container>
			{!noInput && (
				<Container className="flex flex-col gap-4">
					<Input />
				</Container>
			)}
			<Container>
				<Button fullWidth>{actionText}</Button>
			</Container>
		</Container>
	);
};
