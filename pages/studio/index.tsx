/* eslint-disable no-mixed-spaces-and-tabs */
import {treatGraphClient} from "@lib/graphClients";
import {useDisclosure} from "@packages/hooks";
import GenericChainModal from "@packages/modals/GenericChainModal";
import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import {Divider} from "@packages/shared/components/Divider";
import {Heading} from "@packages/shared/components/Typography/Headings";
import {
	ImportantText,
	SmallText,
	Text,
} from "@packages/shared/components/Typography/Text";
import {StackIcon} from "@radix-ui/react-icons";
import axios from "axios";
import TreatCore from "core/TreatCore";
import ApplicationFrame from "core/components/layouts/ApplicationFrame";
import ApplicationLayout from "core/components/layouts/ApplicationLayout";
import {PlusIcon} from "lucide-react";
import Link from "next/link";
import {useEffect, useMemo, useState} from "react";
import {Provider, gql, useQuery} from "urql";
import {useAccount, useWaitForTransaction} from "wagmi";
import Web3 from "web3";
import {LightningBoltIcon} from "@heroicons/react/outline";
import {Verified} from "lucide-react";
import useRedeemV1forV2 from "@packages/chain/hooks/useRedeemV1forV2";
import {useRouter} from "next/router";
import StudioNavigation from "@components/CreatorDashboard/StudioNavigation";
import {toast} from "sonner";
import UserAvatar from "core/auth/components/Avatar";
import {useUser} from "core/auth/useUser";
import formatAddress from "@utils/formatAddress";
import {BigNumber} from "ethers";

export default function TreatCreatorStudio() {
	const {isLoading: isLoadingAccountSummary, data: accountSummary} =
		useAccountSummary();
	const {profile} = useUser();

	return (
		<ApplicationLayout>
			<ApplicationFrame>
				<Provider value={treatGraphClient}>
					<Container className="flex gap-4 py-12 mt-8">
						<Container className="flex flex-col gap-2">
							<Container>
								<Text>
									<ImportantText>Studio</ImportantText>
								</Text>
								<Heading size={"sm"}>Dashboard</Heading>
							</Container>
						</Container>
					</Container>
					<Container className="pb-4 lg:pb-8">
						<StudioNavigation />
					</Container>
					<Container className="flex flex-col justify-between w-full gap-8 lg:flex-row-reverse">
						<Container className="w-full lg:w-96">
							<Container className="flex flex-col gap-8">
								<ConvertV1ToV2NFTCard tokens={accountSummary?.tokens ?? []} />
								<Container
									className="flex flex-col col-span-1 gap-8 p-8 rounded-xl"
									css={{
										background: "$surfaceOnSurface",
										borderColor: "$border",
									}}
								>
									<Container className="flex flex-col items-center gap-4">
										<UserAvatar
											profile_pic={profile?.profile_pic}
											size={64}
											username={profile?.username}
										/>
										<Heading size={"xss"}>{profile?.display_name}</Heading>
										<Text>{formatAddress(profile?.address ?? "")}</Text>
									</Container>

									<AccountSummary
										data={accountSummary}
										isLoading={isLoadingAccountSummary}
										profile={profile ?? {}}
									/>
								</Container>
							</Container>
						</Container>
						<Container className="flex flex-col flex-1 gap-8">
							<SubscriptionNFTsAlert />
							<CreateNFTCard />
						</Container>
					</Container>
				</Provider>
			</ApplicationFrame>
		</ApplicationLayout>
	);
}

const useAccountSummary = () => {
	const {address} = useAccount();
	const accountQuery = gql`
		query getAccountSummary($address: ID!) {
			account(id: $address) {
				id
				totalSales
				balances {
					value
				}
				tokens {
					identifier
					totalSupply
					totalSales
					totalSaleValue
					registry {
						id
					}
				}
			}
		}
	`;

	const [result] = useQuery({
		query: accountQuery,
		variables: {address: address?.toLowerCase()},
	});

	const account = useMemo(() => {
		if (!result.data) return {};
		return result.data.account;
	}, [result]);

	console.log({result});

	return {
		isLoading: result.fetching,
		data: account,
	};
};

function AccountSummary({data, isLoading, profile}) {
	// Get current BNB price
	const {isLoading: bnbPriceLoading, data: bnbPrice} = TreatCore.useQuery({
		queryKey: ["bnbPrice"],
		queryFn: async () => {
			const res = await axios.get(
				"https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd"
			);
			return res.data.binancecoin.usd;
		},
	});

	if (isLoading) return <div>Loading...</div>;

	const totalSaleValue = data.tokens.reduce((a, b) => a + +b.totalSaleValue, 0);

	return (
		<>
			<Container className="flex flex-col gap-2">
				<Text>
					<ImportantText>Total sales</ImportantText>
				</Text>
				<Heading size={"sm"}>
					$
					{!bnbPriceLoading
						? Intl.NumberFormat().format(
								parseFloat(Web3.utils.fromWei(`${totalSaleValue}`)) * bnbPrice
						  )
						: 0}
				</Heading>
				<SmallText>
					<ImportantText>
						{Intl.NumberFormat().format(
							parseFloat(Web3.utils.fromWei(`${totalSaleValue}`))
						)}{" "}
						BNB
					</ImportantText>
				</SmallText>
			</Container>
			<Container className="flex flex-col gap-2">
				<Divider dir={"horizontal"} />
				<table className="table-fixed">
					<tbody>
						<tr>
							<td>
								<Text>Followers</Text>
							</td>
							<td className="text-right">
								<Text>
									<ImportantText>
										{Intl.NumberFormat().format(profile?.followers?.length)}
									</ImportantText>
								</Text>
							</td>
						</tr>
					</tbody>
				</table>
				<Divider />

				<table className="table-fixed">
					<tbody>
						<tr>
							<td>
								<Text>Collected</Text>
							</td>
							<td className="text-right">
								<Text>
									<ImportantText>
										{Intl.NumberFormat().format(data.balances?.length)}
									</ImportantText>
								</Text>
							</td>
						</tr>
					</tbody>
				</table>
				<Divider />
			</Container>
		</>
	);
}

function CreateNFTCard() {
	return (
		<Container
			className="grid grid-cols-1 col-span-1 p-8 rounded-xl"
			css={{
				backgroundColor: "$surfaceOnSurface",
				backgroundRepeat: "no-repeat",
				backgroundSize: "cover",
				backgroundPosition: "bottom right",
				backgroundImage: "url('/assets/svg/create-background.svg')",
			}}
		>
			<Container className="flex flex-col col-span-1 gap-8">
				<Container className="flex flex-col gap-4">
					<Container className="flex items-center gap-2">
						<Text>
							<StackIcon className="w-5 h-5" />
						</Text>
						<Text>
							<ImportantText>Create</ImportantText>
						</Text>
					</Container>
					<Container>
						<Heading size={"xs"}>Mint a new NFT</Heading>
						<Text>You can create NFTs and sell them on the sweetshop.</Text>
					</Container>
				</Container>

				<Container className="mt-auto">
					<Link href={"/create"}>
						<a>
							<Button
								appearance={"action"}
								css={{
									borderRadius: "9999px",
								}}
							>
								<PlusIcon className="w-5 h-5" />
								Create a new NFT
							</Button>
						</a>
					</Link>
				</Container>
			</Container>
		</Container>
	);
}

function ConvertV1ToV2NFTCard({tokens}) {
	const router = useRouter();
	const {
		isOpen: showPendingModal,
		onOpen: openPendingModal,
		onClose: closePendingModal,
	} = useDisclosure();

	const {
		isOpen: showCompleteModal,
		onOpen: openCompleteModal,
		onClose: closeCompleteModal,
	} = useDisclosure();

	const [txHash, setTxHash] = useState("");
	const {isLoading, isSuccess, isError, error} = useWaitForTransaction({
		hash: txHash,
	});

	const v1NFTs = tokens; /*.filter(
		(t) => t.registry.id === "0xde39d0b9a93dcd541c24e80c8361f362aab0f213"
	);*/
	const ids = v1NFTs.map((n) => n.identifier);
	const amounts = v1NFTs.map((n) => n.totalSupply);

	const {onRedeemV1forV2} = useRedeemV1forV2(ids, amounts);

	const tradeInClick = () => {
		openPendingModal();
		onRedeemV1forV2()
			.then((s) => {
				// closePendingModal();
				setTxHash(s.hash);
			})
			.catch((err) => {
				toast.error(err.message);
				closePendingModal();
			});
	};

	useEffect(() => {
		if (isSuccess) {
			closePendingModal();
			openCompleteModal();
		}

		if (isError) {
			toast.error(error.message);
			closeCompleteModal();
			closePendingModal();
		}
	}, [isLoading, isSuccess, isError, error]);

	if (!ids.length) return null;

	return (
		<>
			<GenericChainModal
				isOpen={showPendingModal}
				onClose={() => null}
				title="Trade in your Treat NFTs"
				subtitle="Please confirm the transaction in your wallet and wait..."
				hideClose
				noButton
				loading
			/>
			<GenericChainModal
				isOpen={showCompleteModal}
				onClose={router.reload}
				title="Successfull trade in"
				subtitle="You have successfully traded in your Treat NFTs for v2 NFTs."
				noButton
			/>
			<Container
				className="grid grid-cols-1 col-span-1 p-8 rounded-xl"
				css={{
					backgroundColor: "$surfaceOnSurface",
					backgroundRepeat: "no-repeat",
					backgroundSize: "cover",
					backgroundPosition: "bottom right",
					backgroundImage: "url('/assets/svg/create-background.svg')",
				}}
			>
				<Container className="flex flex-col col-span-1 gap-8">
					<Container className="flex flex-col gap-4">
						<Container className="flex items-center gap-2">
							<Text>
								<LightningBoltIcon className="w-5 h-5" />
							</Text>
							<Text>
								<ImportantText>Convert</ImportantText>
							</Text>
						</Container>
						<Container>
							<Heading size={"xs"}>Trade in legacy NFTs</Heading>
							<Text>
								In order to continue using Treat DAO, and all of our great new
								features including a brand new resale marketplace, you must
								trade in your v1 Treat NFTs for v2 NFTs.
							</Text>
						</Container>
					</Container>

					<Container className="mt-auto">
						<Button
							appearance={"action"}
							css={{
								borderRadius: "9999px",
							}}
							onClick={tradeInClick}
						>
							<LightningBoltIcon className="w-5 h-5" />
							Trade in my Treat NFTs
						</Button>
					</Container>
				</Container>
			</Container>
		</>
	);
}

function SubscriptionNFTsAlert() {
	return (
		<Container
			className="grid grid-cols-1 col-span-1 p-8 rounded-xl"
			css={{
				backgroundColor: "$textContrast",
				backgroundRepeat: "no-repeat",
				backgroundSize: "cover",
				backgroundPosition: "bottom right",
				backgroundImage: "url('/assets/svg/subscriptions-background.svg')",
			}}
		>
			<Container className="flex flex-col col-span-1 gap-8">
				<Container className="flex flex-col gap-4">
					<Container className="flex items-center gap-2">
						<Text css={{color: "$surfaceOnSurface"}}>
							<Verified className="w-5 h-5" />
						</Text>
						<Text css={{color: "$surface"}}>
							<ImportantText>Subscriptions</ImportantText>
						</Text>
					</Container>
					<Container className="flex flex-col gap-2">
						<Heading
							size={"xs"}
							css={{color: "$surface"}}
						>
							We are making subscriptions better
						</Heading>
						<Text css={{color: "$elementOnSurface"}}>
							We are currently working on a new and improved subscriptions
							system that will allow Treat DAO to be more powerful and exciting
							than ever! Stay tuned for updates.
						</Text>
					</Container>
				</Container>
			</Container>
		</Container>
	);
}
