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
import SweetshopNFT from "@components/NFTCard/cards/Sweetshop";

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
					<Container className="grid flex-1 grid-cols-1 gap-8">
						<Heading size={"xss"}>Available Melon NFTs</Heading>
						<FarmersMarket />
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
		<Container className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
			{data.map((nft) => (
				<SweetshopNFT
					{...nft}
					key={nft._id}
				/>
			))}
		</Container>
	);
};
