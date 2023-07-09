/* eslint-disable no-mixed-spaces-and-tabs */
import ApplicationLayout from "core/components/layouts/ApplicationLayout";
import ApplicationFrame from "core/components/layouts/ApplicationFrame";
import {useAccount, useBalance, useContract} from "wagmi";
import {contractAddresses} from "@packages/treat/lib/treat-contracts-constants";
import {Container} from "@packages/shared/components/Container";
import {Heading, Text} from "@packages/shared/components/Typography/Headings";
import {ABI} from "@packages/treat/lib/abi";
import Staking from "@packages/farm/Staking";
import {Button} from "@packages/shared/components/Button";
import {ArrowRight} from "lucide-react";
import Link from "next/link";
import {Divider} from "@packages/shared/components/Divider";
import Disconnected from "@components/ui/disconnected";

// T-78 Use intersection observer to change navbar color.

export default function Farm() {
	const {address} = useAccount();
	const {data: treatMelonBalance} = useBalance({
		token: contractAddresses.melonToken[56],
		addressOrName: address,
	});

	const {data: treatLpBalance} = useBalance({
		token: contractAddresses.treatPancakeLP[56],
		addressOrName: address,
	});

	const {data: treatBalance} = useBalance({
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
				<Container className="h-auto">
					<Container className="py-8 flex flex-col gap-2 mt-4 items-start">
						<Heading size={"sm"}>Farmer's dashboard</Heading>
						<Text css={{fontSize: "1.2rem"}}>
							Stake $Treat to earn $Melon. Exchange $Melon at the Farmers'
							Market to get exclusive NFTs.
						</Text>
						<Link href={"/farm/market"}>
							<a className="mt-8">
								<Button appearance={"success"}>
									Go to farmer's market <ArrowRight className="w-5 h-5" />
								</Button>
							</a>
						</Link>
						<Divider />
					</Container>

					<Container className="flex flex-col flex-wrap w-full gap-12 pt-12 mx-auto">
						{address && (
							<Staking
								treatMelonBalance={treatMelonBalance}
								treatLpBalance={treatLpBalance}
								address={address}
								treatBalance={treatBalance}
								masterMelonContract={masterMelonContract}
							/>
						)}
						{!address && <Disconnected />}
					</Container>
				</Container>
			</ApplicationFrame>
		</ApplicationLayout>
	);
}
