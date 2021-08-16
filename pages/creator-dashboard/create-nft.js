import React, { useState } from "react";
import toBuffer from "blob-to-buffer";
import { Form, Button } from "react-bootstrap";
import { useFormik, FieldArray, FormikProvider } from "formik";
import useCreateAndAddNFTs from "../../hooks/useCreateAndAddNFTs";
import { useRouter } from "next/router";
import Hero from "../../components/Hero";
import CreatingNFTItem from "../../components/CreatingNFTItem";
import { useDropzone } from "react-dropzone";
import { create } from "ipfs-http-client";
import async from "async";
import BlankModal from "../../components/BlankModal";

const client = create("https://ipfs.infura.io:5001/api/v0");

const CreateNFT = () => {
  const [ipfsFiles, setIpfsFiles] = useState([]);
  const router = useRouter();
  const [success, setSuccess] = useState(false);

  const { onCreateAndAddNFTs } = useCreateAndAddNFTs();

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
        list_price: 0,
        description: "",
        blurhash: false,
        image: file,
        max_supply: 10000,
        external_url: "https://treatdao.com/",
        model_handle: "@model",
        model_profile_pic: "pic",
        model_bnb_address: "0x123",
      })),
    },
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
    // validationSchema: Yup.object().shape({
    //   id: Yup.number().required("Please add a nft id"),
    //   name: Yup.string().required("Please add a name"),
    //   list_price: Yup.string().required("Please add the NFT list price"),
    //   description: Yup.string(),
    //   external_url: Yup.string().required("Please add a external_url"),
    //   blurhash: Yup.string().required("Please add a blurhash"),
    //   image: Yup.string().required("Please add a image"),
    //   max_supply: Yup.string().required("Please add a max supply"),
    //   model_handle: Yup.string().required("Please add a model handle"),
    //   model_profile_pic: Yup.string().required(
    //     "Please add a model profile pic"
    //   ),
    //   model_bnb_address: Yup.string().required(
    //     "Please add the model bnb address"
    //   ),
    //   master_password: Yup.string().required("Please add the master password"),
    // }),
    handleChange: (c) => {
      console.log({ c });
    },
    onSubmit: (values) => {
      SubmitToServer();
    },
  });

  const SubmitToServer = async () => {
    try {
      setShowPendingModal(true);
      const maxSupplies = formik.values.nfts.map((n) => n.max_supply);
      const amounts = formik.values.nfts.map((n) => n.list_price);

      const createNFTResult = await onCreateAndAddNFTs(
        maxSupplies,
        amounts,
        "0x"
      );

      const res = await fetch(`/api/nft/create`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formik.values),
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
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (success) return <div>Success.</div>;

  return (
    <FormikProvider value={formik}>
      <BlankModal
        show={!!showPendingModal}
        handleClose={() => setShowPendingModal(false)}
        title={"Waiting for Transaction Confirmation ⌛"}
        subtitle={
          "Please confirm this transaction in your wallet and wait here for upto a few minutes for the transaction to confirm. Do not close this browser window!"
        }
        noButton={true}
      />
      <BlankModal
        show={!!showCompleteModal}
        handleClose={() => setShowCompleteModal(false)}
      />

      <div className="container">
        <Hero
          title="Create New NFTs"
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

export default CreateNFT;
