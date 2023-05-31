import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import {Heading, Text} from "@packages/shared/components/Typography/Headings";
import {ImportantText} from "@packages/shared/components/Typography/Text";
import {useCopyToClipboard} from "@packages/shared/hooks";
import {contractAddresses} from "@packages/treat/lib/treat-contracts-constants";
import axios from "axios";
import TreatCore from "core/TreatCore";
import {CopyIcon, Sparkles, Wallet} from "lucide-react";
import {ArrowRight} from "lucide-react";
import Link from "next/link";

export default function AssetsOverview({
	treatApproved,
	approveTreat,
	lpApproved,
	approveLp,
	treatBalance,
	melonBalance,
}) {
	// Get treat current price from coinmarketcap api
	const url =
		"https://api.coingecko.com/api/v3/simple/price?ids=treatdao-v2&vs_currencies=usd";
	const {
		isLoading,
		data: treatPrice,
		isError,
	} = TreatCore.useQuery(["treat_exchange_rate"], async () => {
		const response = await axios.get(url);
		const treatPrice = response.data["treatdao-v2"].usd;
		return treatPrice;
	});

	return (
		<Container
			css={{backgroundColor: "$surfaceOnSurface", borderColor: "$subtleBorder"}}
			className="grid grid-cols-1 col-span-1 md:col-span-2 p-4 rounded-xl gap-8 border"
		>
			<Heading size={"xs"}>Assets overview</Heading>
			<Container className="flex flex-col gap-4">
				<Heading size={"xss"}>Smart contracts</Heading>
				<Container>
					<SmartContract
						approved={treatApproved}
						approve={approveTreat}
						name={"Treat Farm"}
						address={contractAddresses.masterMelonFarmer[56]}
					/>
					<SmartContract
						approved={lpApproved}
						approve={approveLp}
						name={"Treat Pancake LP Farm"}
						address={contractAddresses.treatPancakeLP[56]}
					/>
				</Container>
			</Container>
			<Container className="flex flex-col gap-4">
				<Heading size={"xss"}>Assets</Heading>
				<Container className="flex flex-col gap-2">
					<Asset
						name={"$TREAT"}
						address={contractAddresses.treatToken[56]}
						balance={isLoading ? null : treatBalance}
						exchangeRate={treatPrice}
					/>
					<Asset
						name={"$MELON"}
						address={contractAddresses.melonToken[56]}
						balance={melonBalance}
					/>
				</Container>
			</Container>
			<Container className="flex gap-4">
				<Button
					css={{
						color: "$accentText",
						borderColor: "$border",
						backgroundColor: "$surfaceOnSurface",
					}}
					className="border shadow"
				>
					<Sparkles className="w-4 h-4" />
					Mint Melon NFT
				</Button>
				<Link href={"/ramp/buy"}>
					<a>
						<Button
							outlined
							className="border shadow"
						>
							Buy $TREAT <ArrowRight className="w-4 h-4" />
						</Button>
					</a>
				</Link>
			</Container>
		</Container>
	);
}

function SmartContract({approve, approved, address, name}) {
	const [, copyAddress] = useCopyToClipboard();

	return (
		<Container className="flex justify-between items-center mt-2">
			<Text className="flex items-center">
				<ImportantText>{name}</ImportantText>
				<Button
					appearance={"link"}
					size={"sm"}
					onClick={() => copyAddress(address)}
				>
					<CopyIcon className="w-4 h-4" />
				</Button>
			</Text>
			<Button
				size={"sm"}
				appearance={approved ? "success" : "action"}
				onClick={approve}
				disabled={approved}
			>
				<Wallet className="w-4 h-4" />
				{approved ? "Approved" : "Approve"}
			</Button>
		</Container>
	);
}

function Asset({
	balance,
	address,
	name,
	exchangeRate,
}: {
	balance?: number;
	address: string;
	name: string;
	exchangeRate?: number;
}) {
	const [, copyAddress] = useCopyToClipboard();
	return (
		<Container className="flex justify-between items-start">
			<Text className="flex items-center">
				<ImportantText>{name}</ImportantText>
				<Button
					appearance={"link"}
					size={"sm"}
					onClick={() => copyAddress(address)}
				>
					<CopyIcon className="w-4 h-4" />
				</Button>
			</Text>
			<Container className="flex flex-col text-right">
				{balance ? (
					<Text>
						<ImportantText>{balance}</ImportantText>
					</Text>
				) : (
					<Container
						css={{
							backgroundColor: "$elementOnSurface",
						}}
						className="py-3 rounded w-32"
					/>
				)}
				{balance ? (
					exchangeRate && (
						<Text>
							$
							{Intl.NumberFormat("en-us", {
								currency: "usd",
							}).format(balance * exchangeRate)}
						</Text>
					)
				) : (
					<Container
						css={{
							backgroundColor: "$elementOnSurface",
						}}
						className="py-3 rounded w-32 mt-2"
					/>
				)}
			</Container>
		</Container>
	);
}
