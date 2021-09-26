import React, { useState } from "react";
import toBuffer from "blob-to-buffer";
import { Form, Button } from "react-bootstrap";
import { useFormik, FieldArray, FormikProvider } from "formik";
import useCreateAndAddNFTs from "../../hooks/useCreateAndAddNFTs";
import { useRouter } from "next/router";
import { useWallet } from "use-wallet";
import Loading from "../../components/Loading";
import Hero from "../../components/Hero";
import CreatingNFTItem from "../../components/CreatingNFTItem";
import { useDropzone } from "react-dropzone";
import { create } from "ipfs-http-client";
import async from "async";
import BlankModal from "../../components/BlankModal";
import BigNumber from "bignumber.js";
import { useEffect } from "react";
import * as Yup from "yup";
import Web3 from "web3";

const client = create("https://ipfs.infura.io:5001/api/v0");

const CreateNFT = ({ modelData }) => {
  const [ipfsFiles, setIpfsFiles] = useState([]);
  const router = useRouter();
  const [success, setSuccess] = useState(false);

  const [showPendingModal, setShowPendingModal] = useState(null);
  const [showCompleteModal, setShowCompleteModal] = useState(null);

  const onDrop = (files) => {
    if (files && files.length > 0) {
      async.map(
        files,
        (file, cb) => {
          toBuffer(file, (err, buff) => {
            console.log({ err, file });
            if (err) return cb(err);
            client.add(buff).then((results) => {
              console.log("=> IPFS Dropzone added: ", results);
              cb(null, `https://ipfs.infura.io/ipfs/${results.path}`);
            });
          });
        },
        (err, results) => {
          if (err)
            return console.error("=> IPFS Dropzone: IPFS Upload Error: ", err);
          console.log({ results });
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
        name: "NFT name here",
        list_price: 1,
        description: "",
        blurhash: false,
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
    handleChange: (c) => {
      console.log({ c });
    },
    onSubmit: (values) => {
      SubmitToServer();
    },
  });

  const [maxSupplyArray, setMaxSupplyArray] = useState(null);
  const [amountsArray, setAmountsArray] = useState(null);

  const { onCreateAndAddNFTs } = useCreateAndAddNFTs(
    maxSupplyArray,
    amountsArray,
    "0x"
  );

  useEffect(() => {
    const maxSupplies = formik.values.nfts.map((n) => n.max_supply);
    const amounts = formik.values.nfts.map(
      (n) => n.list_price && Web3.utils.toWei(n.list_price.toString())
    );

    console.log({ amounts });

    setMaxSupplyArray(maxSupplies);
    setAmountsArray(amounts);
  }, [formik.values.nfts]);

  const SubmitToServer = async () => {
    try {
      setShowPendingModal(true);
      const createNFTResult = await onCreateAndAddNFTs();

      if (!createNFTResult) return setShowPendingModal(false);

      const submitValues = formik.values.nfts.map((nftData, i) => ({
        ...nftData,
        id: createNFTResult.nftIds[i],
        blurhash: nftData.blurhash ? nftData.blurhash : null,
      }));

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
        console.log(resJSON.error);
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
      console.log(error);
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
        show={!!showCompleteModal}
        handleClose={() => setShowCompleteModal(false)}
        buttonAction={() => router.push("/creator-dashboard")}
      />

      <div className="container">
        <Hero
          title="Create Sweet Shop NFTs"
          subtitle="Complete this form carefully. Make sure you don't leave this page after submitting the creation transaction."
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
          <div className="buttons row pt-4">
            <div className="col-md-6 mt-2 text-center">
              <Button variant="light w-100 py-2" onClick={() => router.back()}>
                <b>BACK TO DASHBOARD</b>
              </Button>
            </div>
            <div className="col-md-6  mt-2 text-center">
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
  const { account, status } = useWallet();

  if (status !== "connected" || !props.modelData) {
    return <Loading />;
  } else {
    return <CreateNFT {...props} />;
  }
};

export default CreateNFTWrapper;
