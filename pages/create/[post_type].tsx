import { PostMediaBox } from "@packages/create/components";
import { SEOHead } from "@packages/seo/page";
import { ContextualContainer } from "@packages/shared/components/Container";
import { Heading } from "@packages/shared/components/Typography/Headings";
import { Text } from "@packages/shared/components/Typography/Text";
import ApplicationLayout from "core/components/layouts/ApplicationLayout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ethers } from "ethers";
import ApplicationFrame, {
  FullscreenApplicationFrame,
} from "core/components/layouts/ApplicationFrame";
import { useCreatePost } from "@packages/post/hooks";
import CreateSubscriptionContentPage from "@packages/post/pages/subscription";
import CreateCollectiblePage from "@packages/post/pages/collectible";

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

  const { post_type } = useCreatePost();
  const Page =
    post_type === "subscription"
      ? CreateSubscriptionContentPage
      : CreateCollectiblePage;

  return (
    <ApplicationLayout>
      <SEOHead title="Create a new post" />
      <ApplicationFrame>
        <Page />
      </ApplicationFrame>
    </ApplicationLayout>
  );
}
