import * as Yup from "yup";

import {Button, Form} from "react-bootstrap";
import {FieldArray, FormikProvider, useFormik} from "formik";

import {FormControl} from "react-bootstrap";
import Hero from "@components/Hero";
import Web3 from "web3";
import async from "async";
import axios from "axios";
import {useDropzone} from "react-dropzone";
import {useEffect} from "react";
import {useMoralis} from "react-moralis";
import {useRouter} from "next/router";
import useSWR from "swr";
import {useState} from "react";
import useCreateBulkTotwNFTs from "@packages/chain/hooks/useCreateBulkTotwNFTs";
import {BlankModal} from "@components/lankModal";
import CreatingNFTItem from "@components/CreatingNFTItem";
import Spinner from "@packages/shared/icons/Spinner";

const CreateNFT = () => {
	const [ipfsFiles, setIpfsFiles] = useState([]);
	const router = useRouter();
	const [, setSuccess] = useState(false);

	const [showPendingModal, setShowPendingModal] = useState(null);
	const [showCompleteModal, setShowCompleteModal] = useState(null);
	const [modelUsername, setModelUsername] = useState("");

	const [maxSupplyArray, setMaxSupplyArray] = useState(null);
	const [, setAmountsArray] = useState(null);
	const [totwModelData, setTotwModelData] = useState(null);

	const {data: bnbPrice} = useSWR(
		`https://api.binance.com/api/v3/ticker/price?symbol=BNBUSDT`
	);

	const onDrop = (files) => {
		if (files && files.length > 0) {
			async.map(
				files,
				(file, cb) => {
					const data = new FormData();
					data.append("file", file);

					axios
						.post("https://api.pinata.cloud/pinning/pinFileToIPFS", data, {
							headers: {
								"Content-Type": `multipart/form-data`,
								pinata_api_key: "b949556813c4f284c550",
								pinata_secret_api_key:
									"7a7b755c9c067dedb142c2cb9e9c077aebf561b552c440bf67b87331bac32939",
							},
						})
						.then(function (response) {
							return cb(
								null,
								`https://treatdao.mypinata.cloud/ipfs/${response.data.IpfsHash}`
							);
						});
				},
				(err, results) => {
					if (err)
						return console.error("=> IPFS Dropzone: IPFS Upload Error: ", err);
					setIpfsFiles(results);
				}
			);
		}
	};

	const {
		acceptedFiles: files,
		getRootProps,
		getInputProps,
	} = useDropzone({
		onDrop,
	});

	const formik = useFormik({
		initialValues: {
			nfts: ipfsFiles.map((file) => ({
				name: "",
				list_price: 1,
				description: "",
				blurhash: false,
				tags: [],
				image: file,
				max_supply: 10,
				external_url: "https://treatdao.com/",
				model_handle: totwModelData.username,
				model_profile_pic: totwModelData.profile_pic,
				model_bnb_address: totwModelData.address,
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
					model_profile_pic: Yup.string(),
					model_bnb_address: Yup.string().required(
						"Please add the model bnb address"
					),
				})
			),
		}),
		onSubmit: () => {
			SubmitToServer();
		},
	});

	const {onCreateBulkTotwNFTs} = useCreateBulkTotwNFTs(
		maxSupplyArray,
		totwModelData ? totwModelData.address : "0x"
	);

	const setModelData = async () => {
		const x = await fetch(`/api/admin/get-info/${modelUsername}`);
		const j = await x.json();
		if (!j.username) return;
		setTotwModelData(j);
	};

	useEffect(() => {
		const maxSupplies = formik.values.nfts.map((n) => n.max_supply);
		const amounts = formik.values.nfts.map(
			(n) => n.list_price && Web3.utils.toWei(n.list_price.toString())
		);

		setMaxSupplyArray(maxSupplies);
		setAmountsArray(amounts);
	}, [formik.values.nfts]);

	const SubmitToServer = async () => {
		try {
			setShowPendingModal(true);
			const createNFTResult = await onCreateBulkTotwNFTs();

			if (!createNFTResult) return setShowPendingModal(false);

			const submitValues = formik.values.nfts.map((nftData, i) => ({
				...nftData,
				id: createNFTResult.nftIds[i],
				blurhash: nftData.blurhash ? nftData.blurhash : null,
			}));

			const res = await fetch(`/api/model/create-totm-nfts`, {
				method: "POST",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					nfts: submitValues,
					address: totwModelData.address,
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
				setSuccess(true);
				setShowPendingModal(false);
				setShowCompleteModal(true);
			}
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<FormikProvider value={formik}>
			<BlankModal
				show={!!showPendingModal}
				handleClose={() => setShowPendingModal(false)}
				title={"Confirming Transaction ⌛ - Don't close this browser window"}
				subtitle={
					"Please confirm this transaction in your wallet and wait here for up to a few minutes for the transaction to confirm. Do not close this browser window!"
				}
				noButton={true}
			/>
			<BlankModal
				show={!!showCompleteModal}
				handleClose={() => setShowCompleteModal(false)}
				buttonAction={() => router.push("/dashboard")}
				title="NFTs Created Successfully! 🎉"
				subtitle="Your NFTs have been created and are now available in your dashboard."
			/>

			<div className="container">
				<Hero
					title="Create TOTM NFTs"
					subtitle="Complete this form carefully. Make sure you don't leave this page after submitting the creation transaction."
				/>

				{(!formik.values.nfts || formik.values.nfts.length === 0) && (
					<div className="p-4 white-tp-container col-md-12">
						{!totwModelData && (
							<div className="model-name">
								<div className="pb-4">
									<label>Step 1: Model Username</label>
									<FormControl
										placeholder="E.g. alenaxbt"
										value={modelUsername}
										// onChange={handleChange}
										onChange={(e) => {
											setModelUsername(e.target.value);
										}}
									/>
								</div>

								<Button
									type="submit"
									variant="primary py-2 w-100"
									onClick={() => setModelData()}
								>
									<b>CONTINUE</b>
								</Button>
							</div>
						)}
						{totwModelData && (
							<div
								className="flex col-md-12 dropzone justify-content-center"
								{...getRootProps()}
								style={{minHeight: 200}}
							>
								<input {...getInputProps()} />
								<p
									className="mb-0 text-center"
									style={{fontSize: "1.1em"}}
								>
									Step 2: Drag &#39;n&#39; drop your all your high resolution
									images here, <br />
									or click to here to select them
								</p>
							</div>
						)}
					</div>
				)}

				<Form onSubmit={formik.handleSubmit}>
					<FieldArray
						name="nfts"
						render={(arrayHelpers) =>
							formik.values.nfts &&
							formik.values.nfts.length > 0 &&
							formik.values.nfts.map((nft, i) => (
								<CreatingNFTItem
									bnbPrice={bnbPrice.price}
									formik={formik}
									modelData={totwModelData}
									index={i}
									key={nft.image}
									imageUrl={nft.image}
									handleChange={formik.handleChange}
									blurRequired={false}
									disablePrice={true}
								/>
							))
						}
					/>
					<div className="pt-4 buttons row">
						<div className="mt-2 text-center col-md-6">
							<Button
								variant="w-100 py-2"
								onClick={() => router.back()}
							>
								<b>BACK TO DASHBOARD</b>
							</Button>
						</div>
						<div className="mt-2 text-center col-md-6">
							<Button
								type="submit"
								variant="primary py-2 w-100"
								disabled={ipfsFiles.length === 0}
							>
								<b>CREATE NFTs</b>
							</Button>
						</div>
					</div>
				</Form>
			</div>
		</FormikProvider>
	);
};

const CreateNFTWrapper = (props) => {
	const {isAuthenticated} = useMoralis();

	if (!isAuthenticated) {
		return <Spinner />;
	} else {
		return <CreateNFT {...props} />;
	}
};

export default CreateNFTWrapper;
