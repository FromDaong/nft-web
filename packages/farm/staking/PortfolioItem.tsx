import SwapModal from "@components/Farms/SwapModal";
import {useDisclosure} from "@packages/hooks";
import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import {Heading, Text} from "@packages/shared/components/Typography/Headings";
import {ABI} from "@packages/treat/lib/abi";
import {contractAddresses} from "@packages/treat/lib/treat-contracts-constants";
import {useMemo} from "react";
import {useContract} from "wagmi";

export default function FarmPortfolioItem({
	name,
	balance,
	id,
	currency,
	logo,
	masterMelonContract,
}) {
	const {isOpen, onOpen, onClose} = useDisclosure();

	return (
		<>
			<Container
				onClick={onOpen}
				className="flex items-start justify-between py-2 pr-4 transition-all duration-200 group hover:cursor-pointer rounded-xl hover:bg-zinc-100"
			>
				{isOpen && (
					<SwapModal
						isOpen={isOpen}
						onClose={onClose}
						title={`${name} Staking`}
						currency={currency}
						pid={id}
						balance={balance}
					/>
				)}
				<Container className="flex gap-4 px-2">
					<Container>
						<Heading size={"xss"}>{name}</Heading>
						<Text>{Intl.NumberFormat().format(balance)}</Text>
					</Container>
				</Container>
				<Container className="flex items-center gap-4 px-2">
					<Text>
						${" "}
						{Intl.NumberFormat("en-us", {
							currency: "usd",
						}).format(balance)}
					</Text>
				</Container>
			</Container>
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
