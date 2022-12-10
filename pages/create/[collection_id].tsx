import {PostMediaBox} from "@packages/create/components";
import {SEOHead} from "@packages/seo/page";
import {
	Container,
	ContextualContainer,
} from "@packages/shared/components/Container";
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
import {useFormik} from "formik";
import * as Yup from "yup";
import {ethers} from "ethers";
import ApplicationFrame, {
	FullscreenApplicationFrame,
} from "core/components/layouts/ApplicationFrame";
import {useCreatePost} from "@packages/post/hooks";
import CreateSubscriptionContentPage from "@packages/post/pages/subscription";
import CreateCollectiblePage from "@packages/post/pages/collectible";
import {Button} from "@packages/shared/components/Button";
import {Input, Textarea} from "@packages/shared/components/Input";
import * as Switch from "@radix-ui/react-switch";

export type PostType = {
	type: "livestream" | "nft";
};

export default function PostType() {
	const creatorProfile: any = {};
	const postData: any = {};
	const [ipfsFiles, setIpfsFiles] = useState([]);
	const router = useRouter();
	const [sentWithoutIds, setSentWithoutIds] = useState(false);
	const [sentWithIds, setSentWithIds] = useState(false);

	const [showPendingModal, setShowPendingModal] = useState(null);
	const [showCompleteModal, setShowCompleteModal] = useState(null);

	/*
  const uploadFilesToCDNThenIPFS = () => {
    return;
  };

  const onDrop = (files) => {
    if (files && files.length > 0) {
      Promise.all(
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
            .then(async function (response) {
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

  const formik = useFormik({
    initialValues: {
      nfts: ipfsFiles.map((file) => ({
        list_price: 0.01,
        tags: [],
        image: file,
        max_supply: 10,
      })),
    },
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
    validationSchema: Yup.object().shape({
      id: Yup.number(),
      description: Yup.string(),
      blurhash: Yup.string(),
      image: Yup.string().required("Please add a image"),
      max_supply: Yup.string().required("Please add a max supply"),
    }),
    onSubmit: (values) => {
      SubmitToServer();
    },
  });

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
          address: creatorProfile.address,
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
          address: creatorProfile.address,
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

	const {step, next, prev} = useStep(["upload", "detail"]);

	return (
		<ApplicationLayout>
			<SEOHead title="Create a new post" />
			<ApplicationFrame>
				<Container className="py-12 px-4">
					{step === "upload" ? (
						<UploadMedia next={next} />
					) : (
						<AddNFTDetails
							prev={prev}
							data={[]}
						/>
					)}
				</Container>
			</ApplicationFrame>
		</ApplicationLayout>
	);
}

const UploadMedia = ({next}) => {
	return (
		<Container
			className="border p-8 shadow flex flex-col gap-8"
			css={{background: "$elementSurface", borderRadius: "16px"}}
		>
			<Container className="flex flex-col gap-2">
				<Heading size="sm">Drag and drop media here</Heading>
				<Text>
					Add image, or video files here. Accepted formats are JPG, PNG, JPEG,
					GIF & MP4
				</Text>
			</Container>
			<Container className="flex justify-end">
				<Button onClick={next}>Save and continue</Button>
			</Container>
		</Container>
	);
};

const AddNFTDetails = ({prev, data}) => {
	return (
		<Container className="grid grid-cols-1 gap-8">
			<Container
				className="border p-8 shadow flex flex-col gap-8"
				css={{background: "$elementSurface", borderRadius: "16px"}}
			>
				<Container className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					<Container className="min-h-[320px] rounded-xl bg-gray-200 col-span-1" />

					<Container className="col-span-1 lg:col-span-2">
						<Container className="grid grid-cols-2 gap-4">
							<Container className="col-span-2 flex flex-col gap-1">
								<Text>
									<ImportantText>Name</ImportantText>
								</Text>
								<Input />
							</Container>
							<Container className="col-span-2 flex flex-col gap-1">
								<Text>
									<ImportantText>Description</ImportantText>
								</Text>
								<Textarea />
							</Container>
							<Container className="col-span-1 flex flex-col gap-1">
								<Text>
									<ImportantText>Price</ImportantText>
								</Text>
								<Input />
							</Container>
							<Container className="col-span-1 flex flex-col gap-1">
								<Text>
									<ImportantText>Maximum supply</ImportantText>
								</Text>
								<Input />
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
			<Container className="justify-end py-8 flex flex-col gap-8">
				<Container className="flex justify-end">
					<Button>Publish</Button>
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
