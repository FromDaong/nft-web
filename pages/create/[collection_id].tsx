/* eslint-disable no-mixed-spaces-and-tabs */
import {SEOHead} from "@packages/seo/page";
import {Container} from "@packages/shared/components/Container";
import {Heading} from "@packages/shared/components/Typography/Headings";
import {ImportantText, Text} from "@packages/shared/components/Typography/Text";
import ApplicationLayout from "core/components/layouts/ApplicationLayout";
import {useCallback, useEffect, useState} from "react";
import ApplicationFrame from "core/components/layouts/ApplicationFrame";
import {pagePropsConnectMongoDB} from "@db/engine/pagePropsDB";
import {MongoModelCollection} from "server/helpers/models";
import AddNFTDetails from "@packages/post/CreatePost/NFTDetails";
import UploadMedia from "@packages/form/actions/UploadFiles";
import {File} from "filepond";
import {useAccount, useWaitForTransaction} from "wagmi";
import {useContracts} from "@packages/post/hooks";
import {useStorageService} from "@packages/shared/hooks";
import {BigNumber} from "ethers";
import Web3 from "web3";
import {useDisclosure} from "@packages/hooks";
import GenericChainModal from "@packages/modals/GenericChainModal";
import {useRouter} from "next/router";
import axios from "axios";
import {apiEndpoint} from "@utils/index";
import {useAccountModal, useAddRecentTransaction} from "@rainbow-me/rainbowkit";

export default function PostType(props: {collection: string}) {
	const data = JSON.parse(props.collection);
	const isSubscription = data.isSubscription;
	const [files, setFiles] = useState([]);
	const {step, next, prev} = useStep(["upload", "detail"]);
	const [title, setTitle] = useState("");
	const [mintTxHash, setMintTxHash] = useState("");
	const [nftValues, setNftValues] = useState([]);
	const {isOpen, onOpen, onClose} = useDisclosure();
	const {creatorMartContract, subscriptionsMart} = useContracts();
	const {address} = useAccount();
	const {uploadFile, uploadToIPFS} = useStorageService();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<any>("");
	const [submittedFormState, setSubmittedFormState] = useState({
		values: null,
		actions: null,
	});
	const router = useRouter();
	const transactionManager = useAddRecentTransaction();
	const {openAccountModal} = useAccountModal();
	const {
		isSuccess: isMintTxConfirmed,
		data: mintTxData,
		isError: isMintTxError,
	} = useWaitForTransaction({
		hash: mintTxHash,
	});

	const [modalStep, setModalStep] = useState<{
		status: string;
		title: string;
		subtitle: string;
		actionLabel?: string;
		action?: () => void;
	}>({
		status: "loading",
		title: "🖼️ Uploading your media",
		subtitle:
			"Please wait while we upload your media and start the minting process",
		actionLabel: "",
	});

	const navigateToCollection = () => {
		router.push(`/collection/${data._id}`);
	};

	const addNFTsToCollection = useCallback(() => {
		setIsSubmitting(true);
		setError("");
		setModalStep(processStages.sendingToServer);
		if (mintTxData && !isMintTxError && nftValues.length > 0) {
			axios
				.post(`${apiEndpoint}/marketplace/create`, {
					collection: data,
					nfts: nftValues,
					hash: mintTxHash,
				})
				.then(() => {
					setIsSubmitting(false);
					setModalStep(processStages.txConfirmed);
				})
				.catch((err) => {
					console.error(err);
					setError(err);
					setIsSubmitting(false);
					setModalStep(processStages.serverError);
				});
		}
	}, [mintTxData, nftValues]);

	const createNFTs = async (values, actions) => {
		setError("");
		setSubmittedFormState({values, actions});
		actions.setSubmitting(true);
		onOpen();
		setIsSubmitting(true);
		setModalStep(processStages.uploading);

		try {
			const with_uploaded_images = await Promise.all(
				values.nfts.map(async (n) => {
					const cdn = await uploadFile(n.file);
					const ipfs = await uploadToIPFS(n.file);

					return {...n, cdn, ipfs, subscription_nft: isSubscription};
				})
			);

			// Now create the NFT depending on collection configuration

			let mintTx;
			setModalStep(processStages.requestingConfirmation);

			if (isSubscription) {
				mintTx = await createSubscriberNFTs(with_uploaded_images);
			} else {
				mintTx = await createBasicNFTs(with_uploaded_images);
			}

			// Now we wait for the transaction to be confirmed
			setMintTxHash(mintTx.hash);
			setModalStep(processStages.waitingForTx);
			transactionManager({
				hash: mintTx.hash,
				description: `Minting collection ${data.name} with ${values.nfts.length} NFTs`,
			});

			mintTx.wait().then((res) => {
				const event = res.events.find((e) => e.event === "NFTCreatedAndAdded");
				const args = {...event.args};
				const {nftIds, isGiveAways} = args;

				const collection_data = with_uploaded_images.map((nft, index) => {
					return {
						...nft,
						id: (nftIds[index] as BigNumber).toNumber(),
						isGiveAway: isGiveAways[index],
					};
				});

				setNftValues(collection_data);
			});
		} catch (error) {
			// We have two errors that might occur.
			// 1. Chain Related - Not perfomer, gas, denied Tx
			// 2. Upload related, network or some issues with IPFS & Uploadcare
			console.error({error});
			setError(error);
			setModalStep(processStages.confirmationDenied);
			// setModalStep(processStages.uploadFailed)
			actions.setSubmitting(false);
		}
	};

	const createBasicNFTs = async (nfts) => {
		const amounts_and_supply = {
			amounts: nfts.map((n) => Web3.utils.toWei(n.price.toString())),
			maxSupplys: nfts.map((n) => Web3.utils.toWei(n.maxSupply.toString())),
		};

		const tx = await creatorMartContract.createAndAddNFTs(
			amounts_and_supply.maxSupplys,
			amounts_and_supply.amounts,
			amounts_and_supply.amounts.map(() => false),
			"0x",
			{
				from: address,
				value: 0,
			}
		);

		return tx;
	};

	const createSubscriberNFTs = async (nfts) => {
		const amounts_and_supply = {
			amounts: nfts.map((n) => Web3.utils.toWei(n.price.toString())),
			maxSupplys: nfts.map((n) => Web3.utils.toWei(n.maxSupply.toString())),
		};

		const tx = await subscriptionsMart.createAndAddNFTs(
			amounts_and_supply.maxSupplys,
			amounts_and_supply.amounts,
			amounts_and_supply.amounts.map(() => false),
			"0x",
			{from: address, value: 0}
		);

		return tx;
	};

	const proceedWithFiles = (
		files: Array<{
			file: File;
			type: "image" | "video";
		}>
	) => {
		setFiles(files);
		next();
	};

	const processStages = {
		uploading: {
			status: "loading",
			title: "🖼️ Uploading your media",
			subtitle:
				"Please wait while we upload your media and start the minting process",
		},
		requestingConfirmation: {
			status: "loading",
			title: "🔒 Requesting permission",
			subtitle:
				"We are requesting permission to proceed with the transaction. Please confirm in your wallet to continue.",
		},
		confirmationDenied: {
			status: "error",
			title: "⚠️ Transaction denied",
			subtitle:
				"We were denied permission to proceed with the transaction by your wallet.",
			actionLabel: "Try again",
			action: () =>
				createNFTs(submittedFormState.values, submittedFormState.actions),
		},
		uploadFailed: {
			status: "error",
			title: "⚠️ Media upload failed",
			subtitle:
				"An error happened while we were uploading your media. Please check your network connection and try again.",
			actionLabel: "Try again",
			action: () =>
				createNFTs(submittedFormState.values, submittedFormState.actions),
		},
		waitingForTx: {
			status: "loading",
			title: "💸 Transaction is being confirmed",
			subtitle:
				"Please wait while we confirm your transaction. Please do not close or reload this page before the transaction has been confirmed on the blockchain.",
		},
		sendingToServer: {
			status: "loading",
			title: "💸 Listing on marketplace",
			subtitle:
				"Please wait while we list your collection on the marketplace. Please do not close or reload this page.",
		},
		txConfirmed: {
			status: "success",
			title: "💸 Your NFT Collection has been listed!",
			subtitle:
				"Your transaction has been confirmed on the blockchain. You can now visit the collection and other people can buy your NFTs.",
			actionLabel: "Take me to the collection",
			action: () => navigateToCollection(),
		},
		serverError: {
			status: "error",
			title: "⚠️ A server error occurred",
			subtitle:
				"We encountered an error while trying to list your collection on the marketplace. Please try again.",
			actionLabel: "Try again",
			action: () => addNFTsToCollection(),
		},
		chainError: {
			status: "error",
			title: "⚠️ An error occurred on the blockchain",
			subtitle:
				"An error occured while confirming your transaction on the blockchain. Please check your recent transactions for more.",
			actionLabel: "Try again",
			action: () => openAccountModal(),
		},
	};

	// Set a title for the page
	useEffect(() => {
		if (data) {
			setTitle(data.name);
		}
	}, [data]);

	// Go back to file selector if no media has been selected
	useEffect(() => {
		if (files.length === 0 && step === "detail") {
			prev();
		}
	}, [files]);

	useEffect(() => {
		if (nftValues.length > 0 && isMintTxConfirmed && !isMintTxError) {
			addNFTsToCollection();
		} else if (isMintTxError) {
			setModalStep(processStages.chainError);
		}
	}, [nftValues, isMintTxConfirmed, isMintTxError]);

	return (
		<ApplicationLayout>
			<GenericChainModal
				isOpen={isOpen}
				onClose={onClose}
				hideClose={true}
				title={modalStep.title}
				subtitle={modalStep.subtitle}
				loading={isSubmitting || modalStep.status === "loading"}
				buttonLabel={modalStep.actionLabel}
				noButton={!modalStep.actionLabel}
				action={modalStep.action}
			>
				{error && <Text appearance={"danger"}>{String(error)}</Text>}
			</GenericChainModal>
			<SEOHead title={`Create ${title} Collection - Trit`} />
			<ApplicationFrame>
				<Container className="flex flex-col gap-12 px-4 py-12">
					<Container className="flex flex-col w-full max-w-2xl gap-2">
						<Text css={{color: "$accentText"}}>
							<ImportantText>Creating collection</ImportantText>
						</Text>
						<Heading
							css={{
								minHeight: "16px",
								borderRadius: "8px",
								background: title ? "inherit" : "$elementOnSurface",
								width: title ? "auto" : "400px",
							}}
							size="sm"
						>
							{title}
						</Heading>
					</Container>
					<Container className="max-w-6xl">
						{step === "upload" ? (
							<UploadMedia next={proceedWithFiles} />
						) : (
							<AddNFTDetails
								prev={prev}
								nft_data={files}
								onSubmit={createNFTs}
							/>
						)}
					</Container>
				</Container>
			</ApplicationFrame>
		</ApplicationLayout>
	);
}

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
