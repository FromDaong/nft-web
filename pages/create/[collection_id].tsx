/* eslint-disable no-mixed-spaces-and-tabs */
import {SEOHead} from "@packages/seo/page";
import {Container} from "@packages/shared/components/Container";
import {Heading} from "@packages/shared/components/Typography/Headings";
import {
	ImportantText,
	MutedText,
	SmallText,
	Text,
} from "@packages/shared/components/Typography/Text";
import ApplicationLayout from "core/components/layouts/ApplicationLayout";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {Field, FieldArray, Form, Formik, useFormik} from "formik";
import * as Yup from "yup";
import ApplicationFrame from "core/components/layouts/ApplicationFrame";
import {Button} from "@packages/shared/components/Button";
import {Input, Textarea} from "@packages/shared/components/Input";
import * as Switch from "@radix-ui/react-switch";
import axios from "axios";
import {apiEndpoint} from "@utils/index";
import {pagePropsConnectMongoDB} from "@db/engine/pagePropsDB";
import {MongoModelCollection} from "server/helpers/models";
import {FilePond, registerPlugin} from "react-filepond";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import {File} from "filepond";
import uploadcareClient from "@utils/uploadcare";
import {Player} from "@livepeer/react";
import useUser from "core/auth/useUser";
import {encode} from "blurhash";
import useSWR from "swr";

registerPlugin(
	FilePondPluginImageExifOrientation,
	FilePondPluginImagePreview,
	FilePondPluginFileValidateSize,
	FilePondPluginFileValidateType
);

export default function PostType(props: {collection: string}) {
	const data = JSON.parse(props.collection);
	const postData: any = {};
	const [files, setFiles] = useState([]);
	const router = useRouter();
	const [sentWithoutIds, setSentWithoutIds] = useState(false);
	const [sentWithIds, setSentWithIds] = useState(false);

	const [showPendingModal, setShowPendingModal] = useState(null);
	const [showCompleteModal, setShowCompleteModal] = useState(null);
	const {step, next, prev} = useStep(["upload", "detail"]);
	const [title, setTitle] = useState("");

	useEffect(() => {
		if (data) {
			setTitle(data.name);
		}
	}, [data]);

	const proceedWithFiles = (
		files: Array<{
			cdn: string;
			ipfs: string;
			type: "image" | "video";
			videoInfo?: any;
			blurhash: string;
		}>
	) => {
		setFiles(files);
		next();
	};

	useEffect(() => {
		if (files.length === 0 && step === "detail") {
			prev();
		}
	}, [files]);

	console.log({files});

	return (
		<ApplicationLayout>
			<SEOHead title={`Create ${title} Collection - Trit`} />
			<ApplicationFrame>
				<Container className="py-12 px-4 flex flex-col gap-12">
					<Heading
						css={{
							minHeight: "32px",
							borderRadius: "8px",
							background: title ? "inherit" : "$elementOnSurface",
							width: title ? "auto" : "400px",
						}}
						size="md"
					>
						{title}
					</Heading>
					{step === "upload" ? (
						<UploadMedia next={proceedWithFiles} />
					) : (
						<AddNFTDetails
							prev={prev}
							data={files}
						/>
					)}
				</Container>
			</ApplicationFrame>
		</ApplicationLayout>
	);
}

const UploadMedia = ({next}) => {
	const [files, setFiles] = useState([]);
	const [doneUploading, setDoneUploading] = useState(false);
	const [isUploading, setUploading] = useState(false);
	const [uploadedFiles, setUploadedFiles] = useState([]);
	const [errorFiles, setErrorFiles] = useState([]);

	const uploadFiles = () => {
		setUploading(true);
		setDoneUploading(false);
		Promise.all(
			files.map(async (file: File, index: number) => {
				try {
					const formData = new FormData();
					formData.append("file", file.file);

					const cdn = await uploadcareClient.uploadFile(file.file);

					const ipfs = await axios.post(
						"https://api.pinata.cloud/pinning/pinFileToIPFS",
						formData,
						{
							headers: {
								"Content-Type": `multipart/form-data`,
								pinata_api_key: "b949556813c4f284c550",
								pinata_secret_api_key:
									"7a7b755c9c067dedb142c2cb9e9c077aebf561b552c440bf67b87331bac32939",
							},
						}
					);

					// Add to uploaded files array
					setUploadedFiles((uploaded) => [
						...uploaded,
						{
							filename: file.file.name,
							index: index,
							cdn: cdn.cdnUrl,
							ipfs: `https://treatdao.mypinata.cloud/ipfs/${ipfs.data.IpfsHash}`,
						},
					]);

					// TODO: Don't forget to generate blurhash + poster image for videos

					return {
						cdn: cdn.cdnUrl,
						ipfs: `https://treatdao.mypinata.cloud/ipfs/${ipfs.data.IpfsHash}`,
						type: cdn.isImage ? "image" : "video",
						videoInfo: !cdn.isImage
							? {
									duration: cdn.videoInfo.duration,
									width: cdn.videoInfo.video.width,
									height: cdn.videoInfo.video.height,
							  }
							: null,
					};
				} catch (err) {
					console.log(err);

					// Add to error files array
					setErrorFiles((errored) => [
						...errored,
						{
							filename: file.file.name,
							index: index,
						},
					]);
				}
			})
		).then((files) => {
			setDoneUploading(true);
			setUploading(false);

			next(files);
		});
	};

	useEffect(() => {
		if (files.length > 0) {
			setDoneUploading(true);
		} else {
			setDoneUploading(false);
		}
	}, [files]);

	return (
		<Container
			className="border p-8 shadow flex flex-col gap-8 max-w-2xl"
			css={{background: "$elementSurface", borderRadius: "16px"}}
		>
			<Container className="flex flex-col gap-4">
				<Container className="flex flex-col gap-2">
					<Heading size="xs">Add media to collection</Heading>
					<Text>
						Add image, or video files here. Accepted formats are JPG, PNG, JPEG,
						GIF & MP4
					</Text>
				</Container>
				<FilePond
					files={files}
					onupdatefiles={setFiles}
					allowMultiple={true}
					instantUpload={false}
					name="files"
					maxFileSize={"100MB"}
					labelMaxFileSizeExceeded="File is too large"
					labelMaxFileSize="Maximum file size is {filesize}"
					labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
					fileValidateTypeDetectType={(source, type) =>
						new Promise((resolve, reject) => {
							// Detect image or video and resolve promise
							if (type.startsWith("image/")) {
								resolve(type);
							} else if (type.startsWith("video/")) {
								resolve(type);
							} else {
								reject(type);
							}
						})
					}
					acceptedFileTypes={[
						"image/png",
						"image/jpeg",
						"image/jpg",
						"image/gif",
						"video/mp4",
					]}
					labelFileTypeNotAllowed="Only image and video files are allowed"
				/>
			</Container>
			<Container className="flex justify-end">
				<Button
					disabled={isUploading}
					appearance={
						isUploading || files.length === 0 ? "disabled" : "primary"
					}
					onClick={uploadFiles}
				>
					{isUploading ? "Uploading..." : "Save and continue"}
				</Button>
			</Container>
		</Container>
	);
};

const AddNFTDetails = ({
	prev,
	data,
}: {
	prev: any;
	data: Array<{
		cdn: string;
		ipfs: string;
		type: "image" | "video";
		videoInfo?: any;
		blurhash: string;
	}>;
}) => {
	const {user} = useUser();
	const {data: bnbPrice, error: bnbError} = useSWR(
		`https://api.binance.com/api/v3/ticker/price?symbol=BNBUSDT`
	);
	const [maxSupplyArray, setMaxSupplyArray] = useState(null);
	const [amountsArray, setAmountsArray] = useState(null);

	console.log({data});

	const formik = useFormik({
		initialValues: {
			nfts: data.map((file) => ({
				name: "",
				description: "",
				file: file,
				type: file.type,
				videoInfo: file.videoInfo,
				price: "0.00",
				maxSupply: "0",
				protected: false,
				subscription_nft: false,
				cdn: file.cdn,
				ipfs: file.ipfs,
				blurhash: file.blurhash,
			})),
		},
		enableReinitialize: true,
		validateOnChange: false,
		validateOnBlur: false,
		validationSchema: Yup.object().shape({
			nfts: Yup.array().of(
				Yup.object().shape({
					id: Yup.number(),
					name: Yup.string().required("Please add a name"),
					list_price: Yup.string().required("Please add the NFT list price"),
					description: Yup.string().required("Please add an NFT description"),
					external_url: Yup.string().required("Please add a external_url"),
					blurhash: Yup.string(),
					image: Yup.string().required("Please add a image"),
					max_supply: Yup.string().required("Please add a max supply"),
					model_handle: Yup.string().required("Please add a model handle"),
					model_profile_pic: Yup.string().required(
						"Please add a model profile pic"
					),
					model_bnb_address: Yup.string().required(
						"Please add the model bnb address"
					),
				})
			),
		}),
		onSubmit: (values) => {
			console.log(values);
		},
	});

	/*
	const useCreateAndAddNFTs = (maxSupplyArray, amountsArray, ad = "0x") => {};
	const {
		onCreateAndAddNFTs,
		data: createNFTResult,
		txHash,
	} = useCreateAndAddNFTs(maxSupplyArray, amountsArray, "0x");

  useEffect(() => {
		const maxSupplies = formik.values.nfts.map((n) => n.max_supply);
		const amounts = formik.values.nfts.map(
			(n) =>
				n.list_price && ethers.utils.formatUnits(n.list_price.toString(), "wei")
		);

		setMaxSupplyArray(maxSupplies);
		setAmountsArray(amounts);
	}, [formik.values.nfts]);

	useEffect(() => {
		if (!showPendingModal || !txHash || sentWithoutIds) return;

		(async () => {
			// Create NFTs without NFT IDs
			const submitValues = formik.values.nfts.map((nftData, i) => ({
				...nftData,
				tx_hash: txHash,
				blurhash: nftData.blurhash ? nftData.blurhash : null,
			}));

			const res = await fetch(`/api/model/create-nfts-without-ids`, {
				method: "POST",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					nfts: submitValues,
					address: user.user.address,
				}),
			});
			const resJSON = await res.json();

			if (resJSON.error && resJSON.error.errors) {
				const ogErrors = Object.assign({}, resJSON.error.errors);
				Object.keys(ogErrors).map((e) => {
					ogErrors[e] = resJSON.error.errors[e].message;
				});
				formik.setErrors(ogErrors);
				formik.setSubmitting(false);
			}

			if (resJSON.success) {
				setSentWithoutIds(true);
				setShowPendingModal(false);
				setShowCompleteModal(true);
			}
		})();
	}, [txHash]);

	useEffect(() => {
		if (!createNFTResult || sentWithIds) return;

		(async () => {
			// Create NFTs without NFT IDs
			const submitValues = formik.values.nfts.map((nftData: any, i) => ({
				...nftData,
				id: createNFTResult.nftIds[i],
				blurhash: nftData.blurhash ? nftData.blurhash : null,
			}));

			// Show a modal that we are creating nfts, now they being sent to backend

			const res = await fetch(`/api/model/create-nfts`, {
				method: "POST",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					nfts: submitValues,
					address: user.user.address,
				}),
			});

			const resJSON = await res.json();

			if (resJSON.error && resJSON.error.errors) {
        // We caught an error, do something
				console.error(resJSON.error);
				const ogErrors = Object.assign({}, resJSON.error.errors);
				Object.keys(ogErrors).map((e) => {
					ogErrors[e] = resJSON.error.errors[e].message;
				});
			}

			if (resJSON.success) {
				// Success, redirect user to collection page
			}
		})();
	}, [createNFTResult]);

	const SubmitToServer = async () => {
		try {
			const createNFTResult = await onCreateAndAddNFTs();
		} catch (error) {
			console.error(error);
		}
	};
*/
	return (
		<Formik
			initialValues={{
				nfts: data.map((file) => ({
					name: "",
					description: "",
					file: file,
					type: file.type,
					videoInfo: file.videoInfo,
					price: "0.00",
					maxSupply: "0",
					protected: false,
					subscription_nft: false,
					cdn: file.cdn,
					ipfs: file.ipfs,
				})),
			}}
			onSubmit={console.log}
		>
			{(props) => (
				<Form>
					<Container className="grid grid-cols-1 gap-8">
						<FieldArray name="nfts">
							{(arrayHelpers) => {
								return props.values.nfts.map((file, index) => (
									<Container
										key={file.cdn}
										className="border p-8 shadow flex flex-col gap-8"
										css={{
											background: "$elementSurface",
											borderRadius: "16px",
										}}
									>
										<Container className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
											<Container className="min-h-[320px] h-auto col-span-1">
												{file.type === "image" ? (
													<Container
														css={{
															backgroundImage: `url("${file.cdn}")`,
															backgroundPosition: "center",
															backgroundSize: "cover",
															backgroundColor: "$surfaceOnSurface",
														}}
														className=" rounded-xl bg-gray-200 w-full h-full"
													/>
												) : (
													<Container
														css={{
															backgroundColor: "$surfaceOnSurface",
														}}
														className=" rounded-xl bg-gray-200 w-full h-full overflow-hidden"
													>
														<video
															width="100%"
															autoPlay
															controls
															muted
															loop
															playsInline
															style={{
																left: 0,
																top: 0,
																right: 0,
																bottom: 0,
																height: "100%",
																width: "100%",
															}}
														>
															<source
																src={file.cdn}
																type="video/mp4"
															/>
														</video>
													</Container>
												)}
											</Container>

											<Container className="col-span-1 lg:col-span-2">
												<Container className="grid grid-cols-2 gap-4">
													<Container className="col-span-2 flex flex-col gap-1">
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
													<Container className="col-span-2 flex flex-col gap-1">
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
													<Container className="col-span-1 flex flex-col gap-1">
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
													<Container className="col-span-1 flex flex-col gap-1">
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
													<Container className="flex items-center justify-between gap-8 col-span-2">
														<Container className="flex flex-col">
															<Text>
																<ImportantText>Protected content</ImportantText>
															</Text>
															<Text>
																<MutedText>
																	Only owners of this trit can view its content.
																</MutedText>
															</Text>
														</Container>
														<Container>
															<Switch.Root
																className="SwitchRoot"
																id="airplane-mode"
															>
																<Switch.Thumb className="SwitchThumb" />
															</Switch.Root>
														</Container>
													</Container>
													<Container className="flex items-center justify-between gap-8 col-span-2">
														<Container className="flex flex-col">
															<Text>
																<ImportantText>
																	Subscription content
																</ImportantText>
															</Text>
															<Text>
																<MutedText>
																	Only show to your subscribers
																</MutedText>
															</Text>
														</Container>
														<Container>
															<Switch.Root
																className="SwitchRoot"
																id="airplane-mode"
															>
																<Switch.Thumb className="SwitchThumb" />
															</Switch.Root>
														</Container>
													</Container>
												</Container>
											</Container>
										</Container>
									</Container>
								));
							}}
						</FieldArray>
						<Container className="justify-end py-8 flex flex-col gap-8">
							<Container className="flex justify-end">
								<Button onClick={prev}>Previous</Button>
							</Container>
							<Container className="flex justify-end">
								<Button>Publish</Button>
							</Container>
						</Container>
					</Container>
				</Form>
			)}
		</Formik>
	);
};

const NFTDetailsForm = ({
	bnbPrice,
	file,
	index,
	formik,
	handleChange,
	arrayHelpers,
}) => {
	return (
		<Container
			key={file.cdn}
			className="border p-8 shadow flex flex-col gap-8"
			css={{
				background: "$elementSurface",
				borderRadius: "16px",
			}}
		>
			<Container className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
				<Container className="min-h-[320px] h-auto col-span-1">
					{file.type === "image" ? (
						<Container
							css={{
								backgroundImage: `url("${file.cdn}")`,
								backgroundPosition: "center",
								backgroundSize: "cover",
								backgroundColor: "$surfaceOnSurface",
							}}
							className=" rounded-xl bg-gray-200 w-full h-full"
						/>
					) : (
						<Container
							css={{
								backgroundColor: "$surfaceOnSurface",
							}}
							className=" rounded-xl bg-gray-200 w-full h-full overflow-hidden"
						>
							<video
								width="100%"
								autoPlay
								controls
								muted
								loop
								playsInline
								style={{
									left: 0,
									top: 0,
									right: 0,
									bottom: 0,
									height: "100%",
									width: "100%",
								}}
							>
								<source
									src={file.cdn}
									type="video/mp4"
								/>
							</video>
						</Container>
					)}
				</Container>

				<Container className="col-span-1 lg:col-span-2">
					<Container className="grid grid-cols-2 gap-4">
						<Container className="col-span-2 flex flex-col gap-1">
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
						<Container className="col-span-2 flex flex-col gap-1">
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
						<Container className="col-span-1 flex flex-col gap-1">
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
										{bnbPrice && (
											<Text>
												~ $
												{(bnbPrice * formik.values.nfts[index].price).toFixed(
													2
												)}
											</Text>
										)}
										{meta.touched && meta.error && (
											<Text appearance={"danger"}>
												<SmallText>{meta.error}</SmallText>
											</Text>
										)}
									</Container>
								)}
							</Field>
						</Container>
						<Container className="col-span-1 flex flex-col gap-1">
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
						<Container className="flex items-center justify-between gap-8 col-span-2">
							<Container className="flex flex-col">
								<Text>
									<ImportantText>Protected content</ImportantText>
								</Text>
								<Text>
									<MutedText>
										Only owners of this trit can view its content.
									</MutedText>
								</Text>
							</Container>
							<Container>
								<Field
									as={
										<Switch.Root
											className="SwitchRoot"
											id="airplane-mode"
										>
											<Switch.Thumb className="SwitchThumb" />
										</Switch.Root>
									}
									id={`nfts[${index}].protected`}
									name={`nfts[${index}].protected`}
									checked={!!formik.values.nfts[index].blurhash}
								/>
							</Container>
						</Container>
						<Container className="flex items-center justify-between gap-8 col-span-2">
							<Container className="flex flex-col">
								<Text>
									<ImportantText>Subscription content</ImportantText>
								</Text>
								<Text>
									<MutedText>Only show to your subscribers</MutedText>
								</Text>
							</Container>
							<Container>
								<Switch.Root
									className="SwitchRoot"
									id="airplane-mode"
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
};

const useStep = (steps: Array<string>) => {
	const [step, setStage] = useState(steps[0]);

	const next = () =>
		steps.indexOf(step) !== steps.length - 1 && [
			setStage(steps[steps.indexOf(step) + 1]),
		];

	const prev = () =>
		steps.indexOf(step) !== 0 && [setStage(steps[steps.indexOf(step) - 1])];

	return {
		step,
		next,
		prev,
	};
};

export const getServerSideProps = async (ctx) => {
	await pagePropsConnectMongoDB();

	const {collection_id} = ctx.query;

	const collection = await MongoModelCollection.findById(collection_id);

	return {
		props: {
			collection: JSON.stringify(collection),
		},
	};
};

/*
  const [maxSupplyArray, setMaxSupplyArray] = useState(null);
  const [amountsArray, setAmountsArray] = useState(null);

  useEffect(() => {
    const maxSupplies = formik.values.nfts.map((n) => n.max_supply);
    const amounts = formik.values.nfts.map(
      (n) =>
        n.list_price && ethers.utils.formatUnits(n.list_price.toString(), "wei")
    );

    setMaxSupplyArray(maxSupplies);
    setAmountsArray(amounts);
  }, [formik.values.nfts]);

  const useCreateAndAddNFTs = (maxSupplyArray, amountsArray, ad = "0x") => {};
  const {
    onCreateAndAddNFTs,
    data: createNFTResult,
    txHash,
  } = useCreateAndAddNFTs(maxSupplyArray, amountsArray, "0x");

  useEffect(() => {
    if (!showPendingModal || !txHash || sentWithoutIds) return;

    (async () => {
      // Create NFTs without NFT IDs
      const submitValues = formik.values.nfts.map((nftData, i) => ({
        ...nftData,
        tx_hash: txHash,
        blurhash: nftData.blurhash ? nftData.blurhash : null,
      }));

      const res = await fetch(`/api/model/create-nfts-without-ids`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nfts: submitValues,
          address: user.user.address,
        }),
      });
      const resJSON = await res.json();

      if (resJSON.error && resJSON.error.errors) {
        const ogErrors = Object.assign({}, resJSON.error.errors);
        Object.keys(ogErrors).map((e) => {
          ogErrors[e] = resJSON.error.errors[e].message;
        });
        formik.setErrors(ogErrors);
        formik.setSubmitting(false);
      }

      if (resJSON.success) {
        setSentWithoutIds(true);
        setShowPendingModal(false);
        setShowCompleteModal(true);
      }
    })();
  }, [txHash]);

  useEffect(() => {
    if (!createNFTResult || sentWithIds) return;

    (async () => {
      // Create NFTs without NFT IDs
      const submitValues = formik.values.nfts.map((nftData: any, i) => ({
        ...nftData,
        id: createNFTResult.nftIds[i],
        blurhash: nftData.blurhash ? nftData.blurhash : null,
      }));

      setShowPendingModal(true);
      setShowCompleteModal(false);

      const res = await fetch(`/api/model/create-nfts`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nfts: submitValues,
          address: user.user.address,
        }),
      });

      const resJSON = await res.json();

      if (resJSON.error && resJSON.error.errors) {
        console.error(resJSON.error);
        const ogErrors = Object.assign({}, resJSON.error.errors);
        Object.keys(ogErrors).map((e) => {
          ogErrors[e] = resJSON.error.errors[e].message;
        });
        formik.setErrors(ogErrors);
        formik.setSubmitting(false);
      }
      if (resJSON.success) {
        setSentWithIds(true);
        setShowPendingModal(false);
        setShowCompleteModal(true);
      }
    })();
  }, [createNFTResult]);

  const SubmitToServer = async () => {
    try {
      setShowPendingModal(true);
      const createNFTResult = await onCreateAndAddNFTs();
    } catch (error) {
      console.error(error);
    }
  };
  */
