import {Container} from "@packages/shared/components/Container";
import {Input, Textarea} from "@packages/shared/components/Input";
import {
	ImportantText,
	MutedText,
	SmallText,
	Text,
} from "@packages/shared/components/Typography/Text";
import {Field, FieldArray, Form, Formik, useFormik} from "formik";
import {useState} from "react";
import useSWR from "swr";
import {useAccount, useWaitForTransaction} from "wagmi";
import * as Yup from "yup";
import ImagePreviewWitEditor from "./ImagePreview";
import * as Switch from "@radix-ui/react-switch";
import {Button} from "@packages/shared/components/Button";
import {useContracts} from "../hooks";
import {useUploadcare} from "@packages/shared/hooks";
import {File} from "filepond";
import VideoPreview from "./VideoPreview";

const AddNFTDetails = ({
	prev,
	nft_data,
}: {
	prev: any;
	nft_data: Array<{
		file: File;
		type: "image" | "video";
	}>;
}) => {
	const {data: bnbPrice, error: bnbError} = useSWR(
		`https://api.binance.com/api/v3/ticker/price?symbol=BNBUSDT`
	);
	const {creatorMartContract, subscriptionsMart} = useContracts();
	const {address} = useAccount();
	const [basicTxHash, setBasicTxHash] = useState("");
	const [subscriptionTxHash, setSubscriptionTxHash] = useState("");

	const [tx, setTx] = useState({
		basic: {},
		sub: {},
	});

	const {uploadFile} = useUploadcare();

	const {isSuccess: isBasicTxConfirmed, data: basicTxData} =
		useWaitForTransaction({
			hash: basicTxHash,
		});

	const {isSuccess: isSubscriptionTxSuccess, data: subscriptionData} =
		useWaitForTransaction({
			hash: basicTxHash,
		});

	const createNFTs = async (values) => {
		try {
			const nfts = values.nfts;

			const basic_nfts = nfts.filter((n) => !n.subscription_nft);
			const subscription_nfts = nfts.filter((n) => !n.subscription_nft);

			const basic_tx = createBasicNFTs(basic_nfts);
			const sub_tx = createSubscriberNFTs(subscription_nfts);
			const fn_arr = [basic_tx, sub_tx];

			const results_arr = await Promise.all(fn_arr);
			console.log({results_arr});

			// TODO: Create NFTs on Server
		} catch (error) {
			console.error(error);
		}
	};

	const updateCDNAndUploadToIPFS = async (nfts) => {
		const nfts_with_cdn = await Promise.all(
			nfts.map(async (n) => {
				//const cdn = await uploadToCDN(n.file);
				//const ipfs = await uploadToIPFS(n.file);
				//return {...n, cdn, ipfs};
			})
		);

		return nfts_with_cdn;
	};

	const createBasicNFTs = async (nfts) => {
		const amounts_and_supply = {
			amounts: nfts.map((n) => n.maxSupply),
			maxSupplys: nfts.map((n) => n.price),
		};

		const tx = await creatorMartContract.createAndAddNFTs(
			amounts_and_supply.maxSupplys,
			amounts_and_supply.amounts,
			amounts_and_supply.amounts.map(() => false),
			"0x"
		);

		setBasicTxHash(tx.hash);
		setTx({...tx, basic: tx});
	};

	const createSubscriberNFTs = async (nfts) => {
		const amounts_and_supply = {
			amounts: nfts.map((n) => n.maxSupply),
			maxSupplys: nfts.map((n) => n.price),
		};

		const tx = await subscriptionsMart.createAndAddNFTs(
			amounts_and_supply.maxSupplys,
			amounts_and_supply.amounts,
			amounts_and_supply.amounts.map(() => false),
			"0x",
			{from: address, value: 0}
		);

		setSubscriptionTxHash(tx.hash);
		setTx({...tx, sub: tx});
	};

	return (
		<Formik
			validationSchema={Yup.object().shape({
				nfts: Yup.array().of(
					Yup.object().shape({
						name: Yup.string().required("Name is required"),
						description: Yup.string().required("Description is required"),
						price: Yup.number().required("Price is required"),
						maxSupply: Yup.number()
							.required("Max Supply is required")
							.min(1, "Max Supply must be greater than 0"),
						file: Yup.mixed().required("File is required"),
						type: Yup.string().required("Type is required"),
						protected: Yup.boolean().required("Protected is required"),
					})
				),
			})}
			initialValues={{
				nfts: nft_data.map((file) => ({
					name: "",
					description: "",
					file: file.file,
					type: file.type,
					price: "0.00",
					maxSupply: "1",
					protected: false,
				})),
			}}
			validateOnBlur={true}
			validateOnChange={false}
			onSubmit={(values) => console.log(values)}
		>
			{(props) => (
				<Form>
					<Container className="grid grid-cols-1 gap-8">
						<FieldArray name="nfts">
							{({form}) => {
								return props.values.nfts.map((temp_file, index) => {
									return (
										<Container
											key={temp_file.file.id}
											className="flex flex-col gap-8 p-8 border shadow-sm"
											css={{
												background: "$elementSurface",
												borderRadius: "16px",
											}}
										>
											<Container className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
												<Container className="min-h-[320px] h-auto col-span-1">
													{temp_file.type === "image" ? (
														<ImagePreviewWitEditor
															image={temp_file.file}
															save={(image) => console.log({image})}
														/>
													) : (
														<VideoPreview file={temp_file.file} />
													)}
												</Container>

												<Container className="col-span-1 lg:col-span-2">
													<Container className="grid grid-cols-2 gap-4">
														<Container className="flex flex-col col-span-2 gap-1">
															<Text>
																<ImportantText>Name</ImportantText>
															</Text>
															<Field name={`nfts.${index}.name`}>
																{({field, meta}) => (
																	<Container className="flex flex-col gap-2">
																		<Input
																			type="text"
																			{...field}
																		/>
																		{meta.touched && meta.error && (
																			<Text appearance={"danger"}>
																				<SmallText>{meta.error}</SmallText>
																			</Text>
																		)}
																	</Container>
																)}
															</Field>
														</Container>
														<Container className="flex flex-col col-span-2 gap-1">
															<Text>
																<ImportantText>Description</ImportantText>
															</Text>
															<Field name={`nfts.${index}.description`}>
																{({field, meta}) => (
																	<Container className="flex flex-col gap-2">
																		<Textarea
																			type="text"
																			{...field}
																		/>
																		{meta.touched && meta.error && (
																			<Text appearance={"danger"}>
																				<SmallText>{meta.error}</SmallText>
																			</Text>
																		)}
																	</Container>
																)}
															</Field>
														</Container>
														<Container className="flex flex-col col-span-1 gap-1">
															<Text>
																<ImportantText>Price in BNB</ImportantText>
															</Text>
															<Field name={`nfts.${index}.price`}>
																{({field, meta}) => (
																	<Container className="flex flex-col gap-2">
																		<Input
																			type="number"
																			step={0.01}
																			min={0.0}
																			defaultValue={0.02}
																			{...field}
																		/>
																		{meta.touched && meta.error && (
																			<Text appearance={"danger"}>
																				<SmallText>{meta.error}</SmallText>
																			</Text>
																		)}
																	</Container>
																)}
															</Field>
														</Container>
														<Container className="flex flex-col col-span-1 gap-1">
															<Text>
																<ImportantText>Maximum supply</ImportantText>
															</Text>
															<Field name={`nfts.${index}.maxSupply`}>
																{({field, meta}) => (
																	<Container className="flex flex-col gap-2">
																		<Input
																			type="number"
																			step={1}
																			min={1}
																			defaultValue={10}
																			{...field}
																		/>
																		{meta.touched && meta.error && (
																			<Text appearance={"danger"}>
																				<SmallText>{meta.error}</SmallText>
																			</Text>
																		)}
																	</Container>
																)}
															</Field>
														</Container>
														<Container className="flex items-center justify-between col-span-2 gap-8">
															<Container className="flex flex-col">
																<Text>
																	<ImportantText>
																		Protected content
																	</ImportantText>
																</Text>
																<Text>
																	<MutedText>
																		Only owners of this trit can view its
																		content.
																	</MutedText>
																</Text>
															</Container>
															<Container>
																<Switch.Root
																	className="SwitchRoot"
																	id="airplane-mode"
																	onCheckedChange={(e) =>
																		form.setFieldValue(
																			`nfts.${index}.protected`,
																			e
																		)
																	}
																>
																	<Switch.Thumb className="SwitchThumb" />
																</Switch.Root>
															</Container>
														</Container>
													</Container>
												</Container>
											</Container>
										</Container>
									);
								});
							}}
						</FieldArray>
						<Container className="flex justify-end gap-8 py-8">
							<Container className="flex justify-end">
								<Button
									appearance={"unstyled"}
									onClick={prev}
								>
									Previous
								</Button>
							</Container>
							<Container className="flex justify-end">
								<Button type="submit">Publish</Button>
							</Container>
						</Container>
					</Container>
				</Form>
			)}
		</Formik>
	);
};

export default AddNFTDetails;
