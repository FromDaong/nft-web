import * as Yup from "yup";

import { FieldArray, FormikProvider, useFormik } from "formik";

import BlankModal from "../../components/BlankModal";
import { Button } from "@chakra-ui/react";
import CreatingNFTItem from "../../components/CreatingNFTItem";
import { Flex } from "@chakra-ui/react";
import { Form } from "react-bootstrap";
import Hero from "../../components/Hero";
import Loading from "../../components/Loading";
import Web3 from "web3";
import async from "async";
import axios from "axios";
import useCreateAndAddNFTs from "../../hooks/useCreateAndAddNFTs";
import { useDropzone } from "react-dropzone";
import { useEffect } from "react";
import { useMoralis } from "react-moralis";
import { useRouter } from "next/router";
import useSWR from "swr";
import { useState } from "react";

const CreateNFT = ({ modelData }) => {
  const [ipfsFiles, setIpfsFiles] = useState([]);
  const router = useRouter();
  const [sentWithoutIds, setSentWithoutIds] = useState(false);
  const [sentWithIds, setSentWithIds] = useState(false);
  const { data: bnbPrice, error: bnbError } = useSWR(
    `https://api.binance.com/api/v3/ticker/price?symbol=BNBUSDT`
  );

  const [showPendingModal, setShowPendingModal] = useState(null);
  const [showCompleteModal, setShowCompleteModal] = useState(null);

  const onDrop = (files) => {
    if (files && files.length > 0) {
      async.map(
        files,
        (file, cb) => {
          let data = new FormData();
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
        list_price: 0.01,
        description: "",
        blurhash: false,
        tags: [],
        image: file,
        max_supply: 10,
        external_url: "https://treatdao.com/",
        model_handle: modelData.username,
        model_profile_pic: modelData.profile_pic,
        model_bnb_address: modelData.address,
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
    handleChange: (c) => {},
    onSubmit: (values) => {
      SubmitToServer();
    },
  });

  const [maxSupplyArray, setMaxSupplyArray] = useState(null);
  const [amountsArray, setAmountsArray] = useState(null);

  useEffect(() => {
    const maxSupplies = formik.values.nfts.map((n) => n.max_supply);
    const amounts = formik.values.nfts.map(
      (n) => n.list_price && Web3.utils.toWei(n.list_price.toString())
    );

    setMaxSupplyArray(maxSupplies);
    setAmountsArray(amounts);
  }, [formik.values.nfts]);

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
          address: modelData.address,
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
      const submitValues = formik.values.nfts.map((nftData, i) => ({
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
          address: modelData.address,
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

  return (
    <FormikProvider value={formik}>
      <BlankModal
        show={!!showPendingModal}
        handleClose={() => setShowPendingModal(false)}
        title={"Confirming Transaction ⌛ - Don't close this browser window"}
        centered
        subtitle={
          "Please confirm this transaction in your wallet and wait here for up to a few minutes for the transaction to confirm. Do not close this browser window!"
        }
        noButton={true}
      />
      <BlankModal
        hideClose
        show={!!showCompleteModal}
        handleClose={() => setShowCompleteModal(false)}
        buttonAction={() => router.push("/dashboard")}
      />

      <div className="container">
        <Hero
          title="Create Sweet Shop NFTs"
          subtitle="Complete this form carefully. Make sure you don't leave this page after submitting the creation transaction."
          additionalContent={
            <p
              className="totw-secondary-text m-0 pb-3"
              style={{ maxWidth: "none" }}
            >
              <a
                href="https://help.treatdao.com/en/articles/5761127-how-to-price-your-nfts-to-sell-on-treat"
                target="_blank"
                className="text-primary"
                rel="noreferrer"
              >
                <small>
                  <b>
                    Want to know where to start and how to best price your NFTs?
                    Click here
                  </b>
                </small>
              </a>
            </p>
          }
        />

        {(!formik.values.nfts || formik.values.nfts.length === 0) && (
          <div className="white-tp-container p-4 row">
            <div
              className="dropzone justify-content-center flex"
              {...getRootProps()}
              style={{ minHeight: 200 }}
            >
              <input {...getInputProps()} />
              <p className="mb-0 text-center" style={{ fontSize: "1.1em" }}>
                Step 1: Drag 'n' drop your all your high resolution images here,{" "}
                <br />
                or click to here to select them
              </p>
            </div>
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
                  bnbPrice={bnbPrice && bnbPrice.price}
                  formik={formik}
                  modelData={modelData}
                  index={i}
                  key={nft.image}
                  imageUrl={nft.image}
                  handleChange={formik.handleChange}
                  arrayHelpers={arrayHelpers}
                />
              ))
            }
          />
          <Flex className="flex flex-wrap justify-between md:space-y-0 flex-col md:flex-row space-y-4 pt-4">
            <div className="w-full md:w-1/2 md:pr-2">
              <Button
                variant="text-gray-900 py-2"
                bgColor="white"
                isFullWidth
                onClick={() => router.back()}
              >
                <b>BACK TO DASHBOARD</b>
              </Button>
            </div>
            <div className="w-full md:w-1/2 md:pl-2">
              <Button
                type="submit"
                py={2}
                colorScheme={"primary"}
                isFullWidth
                disabled={ipfsFiles.length === 0}
              >
                <b>CREATE NFTs</b>
              </Button>
            </div>
          </Flex>
        </Form>
      </div>
    </FormikProvider>
  );
};

const CreateNFTWrapper = (props) => {
  const { isAuthenticated } = useMoralis();

  if (!isAuthenticated || !props.modelData) {
    return <Loading />;
  } else {
    return <CreateNFT {...props} />;
  }
};

export default CreateNFTWrapper;
