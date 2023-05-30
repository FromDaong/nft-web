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
import {useHasApprovedFarm} from "./utils";
import {Sparkles, Wallet} from "lucide-react";

export default function Staking({
	treatMelonLoading,
	parseInt,
	treatMelonBalance,
	treatBalance,
	treatLpBalance,
	address,
	masterMelonContract,
}) {
	const bnb_logo_address =
		"https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/smartchain/assets/0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c/logo.png";
	const treatdao_logo = "/favicon copy.png";

	const balances = [treatBalance, treatLpBalance];

	console.log({balances});

	const {hasApproved: treatApproved, approve: approveTreat} =
		useHasApprovedFarm(0);
	const {hasApproved: lpApproved, approve: approveLp} = useHasApprovedFarm(1);

	return (
		<Container className="grid w-full gap-8 lg:w-96">
			<Container className="grid grid-cols-1 p-4 rounded-xl shadow gap-2">
				<Heading size={"xss"}>Farm Contracts</Heading>
				<Container className="flex justify-between items-center mt-4">
					<Text>Treat Staking</Text>
					<Button
						size={"sm"}
						appearance={treatApproved ? "subtle" : "action"}
						onClick={approveTreat}
						disabled={lpApproved}
					>
						<Wallet className="w-5 h-5" />
						{treatApproved ? "Approved" : "Approve"}
					</Button>
				</Container>
				<Container className="flex justify-between items-center">
					<Text>Treat Pancake LP</Text>
					<Button
						size={"sm"}
						appearance={lpApproved ? "subtle" : "action"}
						onClick={approveLp}
						disabled={lpApproved}
					>
						<Wallet className="w-5 h-5" />
						{lpApproved ? "Approved" : "Approve"}
					</Button>{" "}
				</Container>
			</Container>
			<Container
				css={{
					backgroundColor: "$surfaceOnSurface",
					borderColor: "$border",
				}}
				className="flex flex-col shadow rounded-xl h-fit sticky top-[1rem] align-top "
			>
				<Container className="flex flex-col p-2 overflow-hidden rounded-xl">
					{!treatMelonBalance ||
					!treatBalance ||
					!masterMelonContract ||
					!treatLpBalance ? (
						<>
							<FarmPortfolioItemSkeleton />
							<FarmPortfolioItemSkeleton />
						</>
					) : (
						<>
							<FarmPortfolioItem
								balance={balances[0].formatted}
								name="TREAT"
								id={0}
								currency="TREAT"
								logo={bnb_logo_address}
								masterMelonContract={masterMelonContract}
							/>
							<FarmPortfolioItem
								balance={balances[1].formatted}
								name="TREAT/BNB"
								id={1}
								currency="TREAT/BNB"
								logo={bnb_logo_address}
								masterMelonContract={masterMelonContract}
							/>
						</>
					)}
				</Container>
			</Container>
			<Button appearance={"accent"}>
				<Sparkles className="w-5 h-5" />
				Mint an exclusive NFT
			</Button>
		</Container>
	);
}
