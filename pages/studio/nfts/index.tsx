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
import {apiEndpoint, timeFromNow} from "@utils/index";
import axios from "axios";
import TreatCore from "core/TreatCore";
import ApplicationFrame from "core/components/layouts/ApplicationFrame";
import ApplicationLayout from "core/components/layouts/ApplicationLayout";
import {useFormik} from "formik";
import {
	Banknote,
	Edit,
	ExternalLink,
	EyeIcon,
	EyeOff,
	HeartIcon,
	PlusIcon,
} from "lucide-react";
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
import {Verified} from "lucide-react";
import StudioNavigation from "@components/CreatorDashboard/StudioNavigation";

export default function TreatCreatorStudio() {
	const {isLoading: isLoadingAccountSummary, data: accountSummary} =
		useAccountSummary();

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
								<Heading size={"sm"}>Sweetshop NFTs</Heading>
							</Container>
						</Container>
					</Container>
					<Container className="pb-4 lg:pb-8">
						<StudioNavigation />
					</Container>
					<Container className="flex flex-col justify-between w-full gap-8 lg:flex-row-reverse">
						<Container className="flex flex-col flex-1 gap-8">
							{!isLoadingAccountSummary &&
								accountSummary?.tokens?.length === 0 && (
									<Container className="flex justify-center py-32">
										<Container className="flex flex-col gap-8 text-center">
											<Container>
												<Heading size={"sm"}>
													You don't have any NFTs yet
												</Heading>
												<Text>
													You can create your first NFT by clicking the button
													below
												</Text>
											</Container>
											<Link href={"/create"}>
												<a>
													<Button appearance={"action"}>
														<PlusIcon className="w-4 h-4" />
														Create NFT
													</Button>
												</a>
											</Link>
										</Container>
									</Container>
								)}
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
		<Container className="flex flex-col py-2 rounded-xl">
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
		<Container className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4  gap-8">
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
			css={{
				backgroundColor: "$surfaceOnSurface",
			}}
			key={nft._id}
			className="flex flex-col hover:ring-1 ring-purple-600 justify-between gap-4 overflow-hidden rounded-xl"
		>
			<Container
				className="w-full aspect-square"
				css={{
					backgroundColor: "$elementOnSurface",
					background: `url("/api/v3/image/nft/${nft._id}/thumbnail")`,
					backgroundSize: "cover",
				}}
			/>

			<Container className="p-2 flex flex-col gap-2">
				<Container>
					<Heading size={"xss"}>{nft.name}</Heading>
					<Container className={"flex gap-2"}>
						<SmallText>
							<ImportantText>{nft.price} BNB</ImportantText>
						</SmallText>
					</Container>
				</Container>
				<Container className="flex gap-2">
					<Button
						appearance={"subtle"}
						size={"sm"}
					>
						<EyeIcon className="w-4 h-4" />
						{Intl.NumberFormat().format(nft.views?.length ?? 0)}
					</Button>

					<Button
						appearance={"subtle"}
						size={"sm"}
					>
						<Banknote className="w-4 h-4" />
						{Web3.utils.fromWei(totalSale)} BNB
					</Button>
				</Container>

				<Container className="flex justify-between items-center gap-4">
					<Link href={`/studio/nfts/${nft._id}`}>
						<a className="flex-1">
							<Button
								appearance={"surface"}
								size={"sm"}
								fullWidth
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
							className="flex-1"
						>
							<Button
								fullWidth
								appearance={"surface"}
								size={"sm"}
							>
								<ExternalLink className="w-4 h-4" />
								View
							</Button>
						</a>
					</Link>
				</Container>
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
