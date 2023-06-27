/* eslint-disable no-mixed-spaces-and-tabs */
import Tiptap from "@components/ui/tiptap";
import {treatGraphClient} from "@lib/graphClients";
import {useDisclosure} from "@packages/hooks";
import GenericChainModal from "@packages/modals/GenericChainModal";
import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import {Divider} from "@packages/shared/components/Divider";
import {Input} from "@packages/shared/components/Input";
import {Heading} from "@packages/shared/components/Typography/Headings";
import {
	ImportantText,
	SmallText,
	Text,
} from "@packages/shared/components/Typography/Text";
import {StackIcon} from "@radix-ui/react-icons";
import {apiEndpoint, timeFromNow} from "@utils/index";
import axios from "axios";
import TreatCore from "core/TreatCore";
import ApplicationFrame from "core/components/layouts/ApplicationFrame";
import ApplicationLayout from "core/components/layouts/ApplicationLayout";
import {useFormik} from "formik";
import {
	AlertCircleIcon,
	BellIcon,
	Edit,
	ExternalLink,
	EyeOff,
	PlusIcon,
} from "lucide-react";
import Link from "next/link";
import {useEffect, useMemo, useState} from "react";
import {Provider, gql, useQuery} from "urql";
import {useAccount, useWaitForTransaction} from "wagmi";
import Web3 from "web3";
import {RadioGroup} from "@headlessui/react";
import {Globe} from "lucide-react";
import * as yup from "yup";
import {toast} from "sonner";
import Spinner from "@packages/shared/icons/Spinner";
import {LightningBoltIcon} from "@heroicons/react/outline";
import {Verified} from "lucide-react";
import useRedeemV1forV2 from "@packages/chain/hooks/useRedeemV1forV2";
import useGetNftV1Balance from "@packages/chain/hooks/useGetNftV1Balance";
import {useRouter} from "next/router";

export default function TreatCreatorStudio() {
	const {isLoading: isLoadingAccountSummary, data: accountSummary} =
		useAccountSummary();

	return (
		<ApplicationLayout>
			<ApplicationFrame>
				<Provider value={treatGraphClient}>
					<Container className="flex gap-4 py-12 mt-8">
						<Container>
							<Heading size={"md"}>Creator Studio</Heading>
							<Text css={{fontSize: "large"}}>
								Manage your NFTs and view analytics.
							</Text>
						</Container>
					</Container>
					<Container className="flex flex-col justify-between w-full gap-8 lg:flex-row-reverse">
						<Container className="w-full lg:w-96">
							<Container className="flex flex-col gap-8">
								<ConvertV1ToV2NFTCard tokens={accountSummary?.tokens ?? []} />
								<CreateNFTCard />
								<Container
									className="flex flex-col col-span-1 gap-8 p-8 rounded-xl"
									css={{
										background: "$surfaceOnSurface",
										borderColor: "$border",
									}}
								>
									<Heading size={"xs"}>Analytics</Heading>

									<AccountSummary
										data={accountSummary}
										isLoading={isLoadingAccountSummary}
									/>
								</Container>
							</Container>
						</Container>
						<Container className="flex flex-col flex-1 gap-8">
							<SubscriptionNFTsAlert />

							<SweetshopNFTs
								isLoading={isLoadingAccountSummary}
								tokens={accountSummary?.tokens ?? []}
								title={"Sweetshop NFTs"}
							/>
						</Container>
					</Container>
				</Provider>
			</ApplicationFrame>
		</ApplicationLayout>
	);
}

const SweetshopNFTs = ({tokens, isLoading, title}) => {
	return (
		<Container
			className="flex flex-col py-2 overflow-hidden shadow rounded-xl"
			css={{background: "$surfaceOnSurface", borderColor: "$border"}}
		>
			<Container className={"flex gap-1 justify-between items-center p-2"}>
				<Heading size={"xs"}>{title}</Heading>
			</Container>
			<Divider />
			<Container className={"flex flex-col"}>
				<NFTList
					totalSales={tokens.map((t) => t.totalSaleValue) ?? []}
					nftIds={
						tokens
							.filter(
								(t) =>
									t.registry.id === "0x36f8f51f65fe200311f709b797baf4e193dd0b0d"
							)
							.map((t) => t.identifier) ?? []
					}
					isLoadingAccountSummary={isLoading}
				/>
			</Container>
		</Container>
	);
};

async function fetchNFT(id: number): Promise<any> {
	const response = await axios.get<any>(`${apiEndpoint}/nft/${id}`);
	return response.data;
}

const NFTList = ({
	nftIds,
	totalSales,
	isLoadingAccountSummary,
}: {
	nftIds: string[];
	totalSales: string[];
	isLoadingAccountSummary: boolean;
}) => {
	const nftQueries = TreatCore.useQueries({
		queries: nftIds.map((id) => ({
			queryKey: ["nft", id],
			queryFn: () => fetchNFT(parseInt(id)),
		})),
	});

	const nfts = nftQueries.map((query) => query.data).filter(Boolean);

	return (
		<Container className="flex flex-col">
			{isLoadingAccountSummary && (
				<Container className="flex justify-center w-full py-12">
					<Spinner />
				</Container>
			)}
			{nfts.map((nft) => {
				const index = nftIds.indexOf(`${nft.id}`);
				const totalSale = totalSales[index];

				return (
					<NFTCard
						key={nft.id}
						nft={nft}
						totalSale={totalSale}
					/>
				);
			})}
		</Container>
	);
};

const NFTCard = ({nft, totalSale}) => {
	const {isOpen, onOpen, onClose} = useDisclosure();
	return (
		<Container
			key={nft._id}
			css={{
				"&:hover": {
					backgroundColor: "$elementOnSurface",
				},
			}}
			className="flex flex-col flex-wrap justify-between gap-4 p-2 md:flex-row"
		>
			{isOpen && (
				<ManageNFTModal
					isOpen={isOpen}
					onClose={onClose}
					nft={nft}
				/>
			)}
			<Container className="flex gap-4">
				<Container
					className="w-12 rounded h-14"
					css={{
						backgroundColor: "$elementOnSurface",
						background: `url("/api/v3/image/nft/${nft._id}/thumbnail")`,
						backgroundSize: "cover",
					}}
				/>
				<Container className={"flex flex-col gap-1"}>
					<Text css={{color: "$textContrast"}}>
						<ImportantText>{nft.name}</ImportantText>
					</Text>
					<Text>Created {timeFromNow(nft.createdAt)}</Text>
				</Container>
			</Container>
			<Container className="flex flex-col">
				<Text css={{color: "$textContrast"}}>
					<ImportantText>{Web3.utils.fromWei(totalSale)} BNB</ImportantText>
				</Text>
				<Text>At {nft.price} BNB per NFT</Text>
			</Container>
			<Container className="flex items-center gap-4">
				<Link href={`/studio/nfts/${nft._id}`}>
					<a>
						<Button
							className="shadow"
							appearance={"white"}
						>
							<Edit className="w-4 h-4" />
							Edit
						</Button>
					</a>
				</Link>
				<Link href={`/post/nft/${nft._id}?seller=${nft.creator.address}`}>
					<a
						target="_blank"
						rel="noopener noreferrer"
					>
						<Button
							className="shadow"
							appearance={"white"}
						>
							<ExternalLink className="w-4 h-4" />
							View
						</Button>
					</a>
				</Link>
			</Container>
		</Container>
	);
};

const ManageNFTModal = ({isOpen, onClose, nft}) => {
	// if description is plain string convert it to Tiptap

	const mutation = TreatCore.useMutation({
		mutationFn: async (values: {
			name: string;
			description: string;
			price: string;
			protected: boolean;
		}) => {
			const res = await axios.put(
				`${apiEndpoint}/marketplace/nft/${nft._id}/patch`,
				{
					name: values.name,
					description: JSON.stringify(values.description),
					price: values.price,
					protected: values.protected,
				},
				{
					headers: {
						"Content-Type": "application/json",
					},
				}
			);
			return res.data;
		},
		onSuccess: () => {
			TreatCore.queryClient.invalidateQueries(["nft", `${nft.id}`]);
			toast.success("NFT updated successfully");
			onClose();
		},
	});

	const description = useMemo(() => {
		try {
			const parsedDescription = JSON.parse(nft.description ?? "{}");
			return parsedDescription;
		} catch (e) {
			// Create tiptap object with nft.description as one paragraph
			return {
				type: "doc",
				content: [
					{
						type: "paragraph",
						content: [
							{
								type: "text",
								text: nft.description,
							},
						],
					},
				],
			};
		}
	}, [nft.description]);

	const formik = useFormik({
		initialValues: {
			name: nft.name,
			description: description,
			price: nft.price,
			protected: nft.protected,
		},
		onSubmit: (values, {setSubmitting}) => {
			setSubmitting(true);
			mutation.mutate(values);
		},
		validationSchema: yup.object().shape({
			name: yup.string().required("Required"),
			description: yup.object().required("Required"),
			price: yup.string().required("Required"),
		}),
	});

	return (
		<GenericChainModal
			isOpen={isOpen}
			onClose={onClose}
			hideClose
			noButton
			noTitle
		>
			<form onSubmit={formik.handleSubmit}>
				<Container className="flex flex-col items-center w-full gap-4">
					<Container className={"flex gap-8 w-full justify-center"}>
						<Container className="w-64 overflow-hidden shadow-xl rounded-xl aspect-square">
							<Container
								className={`w-full h-full ${
									formik.values.protected ? "blur-xl" : ""
								}`}
								css={{
									backgroundColor: "$elementOnSurface",
									background: `url("/api/v3/image/nft/${nft._id}/thumbnail")`,
									backgroundSize: "cover",
								}}
							/>
						</Container>
					</Container>
					<Container className="w-full">
						<Container className="flex justify-center mb-4">
							<Container
								className="p-1 rounded-xl"
								css={{backgroundColor: "$elementOnSurface"}}
							>
								<RadioGroup
									onChange={(selected) =>
										formik.setFieldValue("protected", selected)
									}
									className="flex items-center w-full max-w-full gap-2 px-2 py-2 overflow-x-auto flex-nowrap scroll-smooth whitespace-wrap"
									defaultValue={formik.values.protected}
								>
									<RadioGroup.Option
										appearance={formik.values.protected ? "action" : "subtle"}
										className="flex-shrink-0"
										value={true}
										as={Button}
										type={"button"}
									>
										<EyeOff className="w-4 h-4" />
										Blur image
									</RadioGroup.Option>
									<RadioGroup.Option
										as={Button}
										appearance={!formik.values.protected ? "action" : "subtle"}
										className="flex-shrink-0"
										value={false}
										type={"button"}
									>
										<Globe className="w-4 h-4" />
										Show image
									</RadioGroup.Option>
								</RadioGroup>
							</Container>
						</Container>
						<Container className="flex flex-col gap-1 mb-2">
							<Heading size={"xs"}>{nft.name}</Heading>
						</Container>
						<Container className="flex flex-col">
							<Heading size={"xss"}>{nft.price} BNB</Heading>
						</Container>
					</Container>
					<Container className="flex flex-col w-full gap-8">
						<Container className="flex flex-col gap-1">
							<label htmlFor={"name"}>
								<Text>
									<ImportantText>Name</ImportantText>
								</Text>
							</label>
							<Input
								name={"name"}
								id={"name"}
								appearance={"solid"}
								value={formik.values.name}
								onChange={formik.handleChange}
								className="w-full"
							/>
						</Container>

						<Container className="flex flex-col gap-1">
							<label>
								<Text>
									<ImportantText>Description</ImportantText>
								</Text>
							</label>
							<Tiptap
								onChange={(json) => {
									formik.setFieldValue("description", json);
								}}
								onError={(error) => {
									formik.setFieldError("description", error);
								}}
								initialValue={formik.values.description}
							/>
						</Container>
					</Container>
					<Container className="flex justify-end w-full gap-4 mt-4">
						<Button
							appearance={"subtle"}
							type={"button"}
							onClick={onClose}
						>
							Cancel
						</Button>
						<Button
							disabled={!formik.isValid || !formik.dirty || formik.isSubmitting}
							appearance={
								(formik.isValid && formik.dirty) || !formik.isSubmitting
									? "default"
									: "disabled"
							}
							type={"submit"}
						>
							{formik.isSubmitting ? (
								<>
									<Spinner />
									Updating...
								</>
							) : (
								"Update"
							)}
						</Button>
					</Container>
				</Container>
			</form>
		</GenericChainModal>
	);
};

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

function AccountSummary({data, isLoading}) {
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
						? Intl.NumberFormat().format(
								parseFloat(Web3.utils.fromWei(data.totalSales)) * bnbPrice
						  )
						: 0}
				</Heading>
				<SmallText>
					<ImportantText>
						{Intl.NumberFormat().format(
							parseFloat(Web3.utils.fromWei(data.totalSales))
						)}{" "}
						BNB
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
										$
										{Intl.NumberFormat().format(
											parseFloat(Web3.utils.fromWei(data.totalSales))
										)}
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
										{Intl.NumberFormat().format(data.balances?.length)}
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
	const {isLoading, isSuccess, isError} = useWaitForTransaction({hash: txHash});

	const v1NFTs = tokens.filter(
		(t) => t.registry.id === "0xde39d0b9a93dcd541c24e80c8361f362aab0f213"
	);
	const ids = v1NFTs.map((n) => n.identifier);
	const amounts = v1NFTs.map((n) => n.totalSupply);

	const {onRedeemV1forV2} = useRedeemV1forV2(ids, amounts);

	const tradeInClick = () => {
		openPendingModal();
		onRedeemV1forV2().then((s) => {
			// closePendingModal();
			setTxHash(s);
		});
	};

	useEffect(() => {
		if (isSuccess) {
			closePendingModal();
			openCompleteModal();
		}
	}, [isLoading, isSuccess, isError]);

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
							<Verified className="w-5 h-5" />
						</Text>
						<Text>
							<ImportantText>Subscriptions</ImportantText>
						</Text>
					</Container>
					<Container className="flex flex-col gap-2">
						<Heading size={"xs"}>We are making subscriptions better</Heading>
						<Text>
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
