/* eslint-disable no-mixed-spaces-and-tabs */
import ApplicationLayout from "core/components/layouts/ApplicationLayout";
import ApplicationFrame from "core/components/layouts/ApplicationFrame";
import {useAccount, useBalance, useContract} from "wagmi";
import {contractAddresses} from "@packages/treat/lib/treat-contracts-constants";
import {Container} from "@packages/shared/components/Container";
import {Heading, Text} from "@packages/shared/components/Typography/Headings";
import {ABI} from "@packages/treat/lib/abi";
import Spinner from "@packages/shared/icons/Spinner";
import StudioNavigation from "@components/CreatorDashboard/StudioNavigation";
import Staking from "@packages/farm/Staking";
import TreatCore from "core/TreatCore";
import axios from "axios";
import {apiEndpoint, legacy_nft_to_new} from "@utils/index";
import FarmNFT from "@components/NFTCard/cards/FarmNFT";
import {Button} from "@packages/shared/components/Button";
import {Sparkles} from "lucide-react";

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
					className="flex gap-8 h-full w-full"
					css={{borderColor: "$border"}}
				>
					<Container className="h-fit w-96">
						<StudioNavigation />
					</Container>
					<Container className="flex-1 h-auto">
						{false && treatMelonLoading && (
							<Container className="flex flex-col items-center justify-center w-full min-h-screen">
								<Spinner />
								<Heading size="xs">Please wait. Loading...</Heading>
							</Container>
						)}
						{false && treatError && (
							<Container className="flex flex-col items-center justify-center w-full min-h-screen gap-2 text-center">
								<Heading size="xs">An error occured</Heading>
								<Text>
									Please check your internet connection and reload the page.
								</Text>
							</Container>
						)}
						<Container className="flex flex-col flex-wrap w-full gap-12 pt-12 mx-auto">
							<Staking
								treatMelonBalance={treatMelonBalance}
								treatLpBalance={treatLpBalance}
								address={address}
								treatBalance={treatBalance}
								masterMelonContract={masterMelonContract}
							/>
							<Container className="grid flex-1 grid-cols-1 gap-8">
								<Container className="w-full flex justify-between items-baseline">
									<Heading size={"xss"}>Available Melon NFTs</Heading>
									<Button appearance={"accent"}>
										<Sparkles className="w-4 h-4" />
										Mint exclusive NFT
									</Button>
								</Container>
								<FarmersMarket />
							</Container>
						</Container>
					</Container>
				</Container>
			</ApplicationFrame>
		</ApplicationLayout>
	);
}

const FarmersMarket = () => {
	const {data, isLoading, isError} = TreatCore.useQuery(
		["melon_nfts"],
		async () => {
			try {
				const res = await axios.get(`${apiEndpoint}/marketplace/melon`);
				return res.data.data.map((nft) =>
					legacy_nft_to_new({
						...nft,
						price: 0,
					})
				);
			} catch (err) {
				console.error(err);
				return [];
			}
		}
	);

	if (isLoading) return <Spinner />;
	return (
		<Container className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
			{data.map((nft) => (
				<FarmNFT
					{...nft}
					key={nft._id}
				/>
			))}
		</Container>
	);
};
