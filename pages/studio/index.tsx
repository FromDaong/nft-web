/* eslint-disable no-mixed-spaces-and-tabs */
import Tiptap from "@components/ui/tiptap";
import {treatGraphClient} from "@lib/graphClients";
import {useDisclosure} from "@packages/hooks";
import GenericChainModal from "@packages/modals/GenericChainModal";
import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import {Divider} from "@packages/shared/components/Divider";
import {Input, Textarea} from "@packages/shared/components/Input";
import {Heading} from "@packages/shared/components/Typography/Headings";
import {
	ImportantText,
	MutedText,
	SmallText,
	Text,
} from "@packages/shared/components/Typography/Text";
import {ArrowRightIcon, StackIcon} from "@radix-ui/react-icons";
import {apiEndpoint, formatAddress, timeFromNow} from "@utils/index";
import Avvvatars from "avvvatars-react";
import axios from "axios";
import TreatCore from "core/TreatCore";
import ApplicationFrame from "core/components/layouts/ApplicationFrame";
import ApplicationLayout from "core/components/layouts/ApplicationLayout";
import {useFormik} from "formik";
import {Edit, ExternalLink, EyeOff, Pause, WholeWord} from "lucide-react";
import Link from "next/link";
import {useMemo} from "react";
import {Provider, gql, useQuery} from "urql";
import {useAccount} from "wagmi";
import Web3 from "web3";
import {RadioGroup} from "@headlessui/react";
import {Globe} from "lucide-react";
import * as yup from "yup";
import {toast} from "sonner";
import Spinner from "@packages/shared/icons/Spinner";

export default function TreatCreatorStudio() {
	const {isLoading: isLoadingAccountSummary, data: accountSummary} =
		useAccountSummary();

	return (
		<ApplicationLayout>
			<ApplicationFrame>
				<Provider value={treatGraphClient}>
					<Container className="py-8 flex flex-col gap-4 mt-8">
						<Container>
							<Heading size={"sm"}>Treat Creator Studio</Heading>
							<Text
								className="mt-2"
								css={{fontSize: "1.2rem"}}
							>
								Your studio is where you can create and manage your NFTs.
							</Text>
						</Container>
					</Container>
					<Container className="grid grid-cols-1 lg:grid-cols-2 gap-8 py-8">
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
									<Heading size={"xss"}>Create</Heading>
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
												Create a new NFT <ArrowRightIcon />
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

							<AccountSummary
								data={accountSummary}
								isLoading={isLoadingAccountSummary}
							/>
						</Container>
						<Container
							className="flex flex-col col-span-1 lg:col-span-2 rounded-xl border"
							css={{background: "$surfaceOnSurface", borderColor: "$border"}}
						>
							<Container
								className={"flex flex-col gap-1 justify-between p-8 pb-4"}
							>
								<Heading size={"xs"}>Manage NFTs</Heading>
								<Text>Update your NFTs, view sales, and more.</Text>
							</Container>
							<Container className={"flex flex-col gap-4 p-4"}>
								<SalesPreview
									totalSales={
										(accountSummary?.tokens ?? []).map(
											(t) => t.totalSaleValue
										) ?? []
									}
									nftIds={
										(accountSummary?.tokens ?? []).map((t) => t.identifier) ??
										[]
									}
								/>
							</Container>
						</Container>
					</Container>
				</Provider>
			</ApplicationFrame>
		</ApplicationLayout>
	);
}

async function fetchNFT(id: number): Promise<any> {
	const response = await axios.get<any>(`${apiEndpoint}/nft/${id}`);
	return response.data;
}

const SalesPreview = ({
	nftIds,
	totalSales,
}: {
	nftIds: string[];
	totalSales: string[];
}) => {
	const nftQueries = TreatCore.useQueries({
		queries: nftIds.map((id) => ({
			queryKey: ["nft", id],
			queryFn: () => fetchNFT(parseInt(id)),
		})),
	});

	const nfts = nftQueries.map((query) => query.data).filter(Boolean);

	return (
		<Container className="flex flex-col gap-1">
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
			className="flex flex-col md:flex-row flex-wrap gap-4 justify-between p-4 rounded-xl"
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
					className="w-16 h-16 rounded-xl"
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
			<Container className="flex gap-4 items-center">
				<Button
					className="shadow"
					appearance={"white"}
					onClick={onOpen}
				>
					<Edit className="w-4 h-4" />
					Edit
				</Button>
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
				<Container className="flex flex-col items-center gap-4 w-full">
					<Container className={"flex gap-8 w-full justify-center"}>
						<Container className="w-64 rounded-xl shadow-xl aspect-square overflow-hidden">
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
									className="flex items-center w-full max-w-full gap-2 py-2 overflow-x-auto flex-nowrap px-2 scroll-smooth whitespace-wrap"
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
					<Container className="flex flex-col gap-8 w-full">
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
					<Container className="flex justify-end gap-4 w-full mt-4">
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
