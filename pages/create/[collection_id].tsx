/* eslint-disable no-mixed-spaces-and-tabs */
import {SEOHead} from "@packages/seo/page";
import {Container} from "@packages/shared/components/Container";
import {Heading} from "@packages/shared/components/Typography/Headings";
import {ImportantText, Text} from "@packages/shared/components/Typography/Text";
import ApplicationLayout from "core/components/layouts/ApplicationLayout";
import {useEffect, useState} from "react";
import ApplicationFrame from "core/components/layouts/ApplicationFrame";
import {pagePropsConnectMongoDB} from "@db/engine/pagePropsDB";
import {MongoModelCollection} from "server/helpers/models";
import AddNFTDetails from "@packages/post/CreatePost/NFTDetails";
import UploadMedia from "@packages/form/actions/UploadFiles";
import {File} from "filepond";

export default function PostType(props: {collection: string}) {
	const data = JSON.parse(props.collection);
	const [files, setFiles] = useState([]);
	const {step, next, prev} = useStep(["upload", "detail"]);
	const [title, setTitle] = useState("");

	useEffect(() => {
		if (data) {
			setTitle(data.name);
		}
	}, [data]);

	const proceedWithFiles = (
		files: Array<{
			file: File;
			type: "image" | "video";
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

	return (
		<ApplicationLayout>
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
