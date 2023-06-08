// @ts-nocheck

import ActivityItem from "@components/CreatorDashboard/Activity/Item";
import StudioNavigation from "@components/CreatorDashboard/StudioNavigation";
import {treatGraphClient} from "@lib/graphClients";
import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import {Divider} from "@packages/shared/components/Divider";
import {Heading} from "@packages/shared/components/Typography/Headings";
import {
	ImportantText,
	SmallText,
	Text,
} from "@packages/shared/components/Typography/Text";
import {
	ArrowRightIcon,
	ExternalLinkIcon,
	StackIcon,
} from "@radix-ui/react-icons";
import {formatAddress, timeFromNow} from "@utils/index";
import Avvvatars from "avvvatars-react";
import axios from "axios";
import TreatCore from "core/TreatCore";
import ApplicationFrame from "core/components/layouts/ApplicationFrame";
import ApplicationLayout from "core/components/layouts/ApplicationLayout";
import {ArrowRight} from "lucide-react";
import {ExternalLink} from "lucide-react";
import Link from "next/link";
import {useMemo} from "react";
import {Provider, gql, useQuery} from "urql";
import {useAccount} from "wagmi";
import Web3 from "web3";

export default function TreatCreatorStudio() {
	return (
		<ApplicationLayout>
			<StudioNavigation />

			<ApplicationFrame>
				<Provider value={treatGraphClient}>
					<Container className="py-8 flex flex-col gap-4 mt-8">
						<Container>
							<Heading size={"xs"}>
								Get started with your TreatDAO studio
							</Heading>
							<Text className="mt-2">
								Your studio is where you can create and manage your NFT
								collections.
							</Text>
						</Container>
						<Container className="grid grid-cols-1 max-w-screen-md mt-4">
							<Container className="flex justify-between p-2 items-start">
								<Container className="flex gap-4">
									<Avvvatars
										style="shape"
										value={"0x0"}
										size={32}
										radius={6}
									/>
									<Container className="flex flex-col gap-2">
										<Heading size={"xss"}>Create a new collection</Heading>
										<Text>
											A collection allows you to group your NFTs together.
										</Text>
									</Container>
								</Container>
								<Container className="mt-auto">
									<Link href={"/create"}>
										<a>
											<Button
												appearance={"subtle"}
												css={{borderRadius: "9999px"}}
											>
												<ArrowRight className="w-5 h-5" />
											</Button>
										</a>
									</Link>
								</Container>
							</Container>
							<Container className="flex justify-between p-2 items-start">
								<Container className="flex gap-4">
									<Avvvatars
										style="shape"
										value={"0x0"}
										size={32}
										radius={6}
									/>
									<Container className="flex flex-col gap-2">
										<Heading size={"xss"}>Create a new NFT</Heading>
										<Text>
											An NFT is a unique digital item that you can sell on the
											sweetshop
										</Text>
									</Container>
								</Container>
								<Container className="mt-auto">
									<Link href={"/create"}>
										<a>
											<Button
												appearance={"subtle"}
												css={{borderRadius: "9999px"}}
											>
												<ArrowRight className="w-5 h-5" />
											</Button>
										</a>
									</Link>
								</Container>
							</Container>
							<Container className="flex justify-between p-2 items-start">
								<Container className="flex gap-4">
									<Avvvatars
										style="shape"
										value={"0x0"}
										size={32}
										radius={6}
									/>
									<Container className="flex flex-col gap-2">
										<Heading size={"xss"}>Stake $TREAT</Heading>
										<Text>
											The more $TREAT you stake, the more rewards you earn.
										</Text>
									</Container>
								</Container>
								<Container className="mt-auto">
									<Link href={"/create"}>
										<a>
											<Button
												appearance={"subtle"}
												css={{borderRadius: "9999px"}}
											>
												<ArrowRight className="w-5 h-5" />
											</Button>
										</a>
									</Link>
								</Container>
							</Container>
						</Container>
						<Container className="py-4">
							<Button appearance={"link"}>
								Or browse the sweetshop <ArrowRight className="h-4 w-4" />
							</Button>
						</Container>
					</Container>
					<Container className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8">
						<Container
							className="grid grid-cols-1 md:grid-cols-2 col-span-1 p-8 shadow-sm border rounded-xl"
							css={{
								background: "$surfaceOnSurface",
								borderColor: "$border",
								backgroundRepeat: "no-repeat",
								backgroundSize: "contain",
								backgroundPosition: "bottom right",
							}}
						>
							<Container className="flex flex-col col-span-1 gap-8">
								<Container className="flex items-center gap-2">
									<Heading size={"xss"}>
										<StackIcon className="w-8 h-8" />
									</Heading>
									<Heading size={"xss"}>Collections</Heading>
								</Container>
								<Heading
									size={"md"}
									className={"lg:max-w-[320px]"}
								>
									Sell your NFTs on the sweetshop.
								</Heading>

								<Container className="mt-auto">
									<Link href={"/create"}>
										<a>
											<Button css={{borderRadius: "9999px"}}>
												Create a new collection <ArrowRightIcon />
											</Button>
										</a>
									</Link>
								</Container>
							</Container>
							<Container></Container>
						</Container>
						<Container
							className="flex flex-col col-span-1 gap-8 p-8 rounded-xl border"
							css={{background: "$surfaceOnSurface", borderColor: "$border"}}
						>
							<Heading size={"xs"}>Analytics</Heading>

							<AccountSummary />
						</Container>
						<Container
							className="flex flex-col col-span-1 md:col-span-2 rounded-xl border"
							css={{background: "$surfaceOnSurface", borderColor: "$border"}}
						>
							<Container className={"flex justify-between p-8 pb-4"}>
								<Heading size={"xs"}>Sales</Heading>
								<Link href={"/studio/sales"}>
									<a>
										<ImportantText
											css={{color: "$accentText", display: "flex"}}
											className={"items-center gap-2"}
										>
											View all <ArrowRightIcon />
										</ImportantText>
									</a>
								</Link>
							</Container>
							<Container className={"flex flex-col gap-4 p-4"}>
								<SalesPreview />
							</Container>
						</Container>
					</Container>
				</Provider>
			</ApplicationFrame>
		</ApplicationLayout>
	);
}

const useMySalesHistory = () => {
	const salesHistory = () => gql`
		query getSales($first: Int, $address: String) {
			sales(
				first: 5
				orderBy: "purchaseDate"
				orderDirection: "desc"
				where: {
					seller: $address
					sourceContract: "0xA38978E839c08046FA80B0fee55736253Ab3B8a3"
				}
			) {
				id
				cost
				sourceContract
				treatsPurchased
				seller
				buyer
				purchaseDate
			}
		}
	`;

	const {address} = useAccount();
	const [result] = useQuery({
		query: salesHistory(address),
		variables: {address},
	});

	const txHistory = useMemo(() => {
		if (!result.data) return [];
		return result.data.sales;
	}, [result]);

	const {isLoading, data} = TreatCore.useQuery({
		queryKey: [`creatorSales:${address}`],
		queryFn: async () => {
			const addresses = (txHistory ?? []).map((tx) => tx.seller.toLowerCase());
			const res = await axios.post(`${apiEndpoint}/people/get-by-address`, {
				addresses,
			});
			return res.data.data;
		},
		enabled: txHistory.length > 0,
	});

	const txHistoryWithProfile = useMemo(() => {
		if (!data) return [];
		return txHistory.map((tx) => {
			const buyer = data.find(
				(profile) => profile.address.toLowerCase() === tx.buyer.toLowerCase()
			);
			const seller = data.find(
				(profile) => profile.address.toLowerCase() === tx.seller.toLowerCase()
			);
			return {
				...tx,
				buyer: buyer || {address: tx.buyer},
				seller: seller || {address: tx.seller},
				buyerAddress: tx.buyer,
				sellerAddress: tx.seller,
			};
		});
	}, [data]);

	return {
		isLoading,
		data: txHistoryWithProfile,
		txHistory,
	};
};

const SalesPreview = () => {
	const {data, isLoading, txHistory} = useMySalesHistory();
	return (
		<Container className="flex flex-col gap-1">
			{!isLoading &&
				txHistory.map((tx) => (
					<SalesItem
						key={tx._id}
						{...tx}
					/>
				))}
		</Container>
	);
};

function SalesItem({
	id,
	cost,
	sourceContract,
	treatsPurchased,
	seller,
	buyer,
	purchaseDate,
}) {
	return (
		<a
			href={`https://bscscan.com/tx/${id}`}
			target={"_blank"}
			rel="noreferrer"
		>
			<Container
				css={{
					"&:hover": {
						background: "$elementOnSurface",
					},
				}}
				className="flex flex-col gap-2 rounded-xl p-4"
			>
				<Container className={"flex justify-between"}>
					<Container className={"flex gap-4"}>
						<Avvvatars
							style="shape"
							value={buyer}
							size={32}
							radius={6}
						/>
						<Container>
							<Heading size={"xss"}>Mother of Beauty</Heading>
							<Text>
								{formatAddress(buyer)} &bull; {timeFromNow(purchaseDate * 1000)}
							</Text>
						</Container>
					</Container>
					<Container className={"flex gap-2 items-start"}>
						<Heading size={"xss"}>{Web3.utils.fromWei(cost)} BNB</Heading>{" "}
						<Button
							appearance={"unstyled"}
							className="p-0"
						>
							<ExternalLink className="w-4 h-4" />
						</Button>
					</Container>
				</Container>
			</Container>
		</a>
	);
}

const useAccountSummary = () => {
	const {address} = useAccount();
	const accountQuery = gql`
		query getAccountSummary($address: String!) {
			account(id: $address) {
				id
				totalSales
				balances {
					value
				}
				tokens {
					identifier
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

	return {
		isLoading: result.fetching,
		data: account,
	};
};
function AccountSummary() {
	const {isLoading, data} = useAccountSummary();
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
	return (
		<>
			<Container className="flex flex-col gap-2">
				<Text>
					<ImportantText>Total sales</ImportantText>
				</Text>
				<Heading size={"sm"}>
					$
					{!bnbPriceLoading
						? Intl.NumberFormat().format(data.totalSales * bnbPrice)
						: 0}
				</Heading>
				<SmallText>
					<ImportantText>
						{Intl.NumberFormat().format(data.totalSales)} BNB
					</ImportantText>
				</SmallText>
			</Container>
			<Divider dir={"horizontal"} />
			<Container className="flex flex-col gap-2">
				<Heading size={"xss"}>Summary</Heading>
				<table className="table-fixed">
					<tbody>
						<tr>
							<td>
								<Text>Revenue</Text>
							</td>
							<td>
								<Text>
									<ImportantText>
										${Intl.NumberFormat().format(data.totalSales)}
									</ImportantText>
								</Text>
							</td>
						</tr>
						<tr>
							<td>
								<Text>Created</Text>
							</td>
							<td>
								<Text>
									<ImportantText>
										{Intl.NumberFormat().format(data.tokens?.length)}
									</ImportantText>
								</Text>
							</td>
						</tr>
						<tr>
							<td>
								<Text>Collected</Text>
							</td>
							<td>
								<Text>
									<ImportantText>
										{Intl.NumberFormat().format(data.balances.length)}
									</ImportantText>
								</Text>
							</td>
						</tr>
					</tbody>
				</table>
			</Container>
		</>
	);
}
