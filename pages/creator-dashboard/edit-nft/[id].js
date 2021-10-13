import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import { useFormik, FieldArray, FormikProvider } from "formik";
import useAddCreatorNFTs from "../../../hooks/useAddCreatorNft";
import { useRouter } from "next/router";
import { useWallet } from "use-wallet";
import Loading from "../../../components/Loading";
import Hero from "../../../components/Hero";
import EditingNFTItem from "../../../components/EditingNFTItem";
import { create } from "ipfs-http-client";
import BlankModal from "../../../components/BlankModal";
import * as Yup from "yup";
import Web3 from "web3";

const client = create("https://ipfs.infura.io:5001/api/v0");

const CreateNFT = ({ modelData, id }) => {
  const router = useRouter();
  const [success, setSuccess] = useState(false);

  const [showPendingModal, setShowPendingModal] = useState(null);
  const [showCompleteModal, setShowCompleteModal] = useState(null);

  const [nftData, setNftData] = useState(null);

  useEffect(() => {
    fetch(`/api/model/find-nft/${id}`)
      .then((r) => r.json())
      .then((json) => {
        setNftData(json);
      });
  }, [id]);

  const formik = useFormik({
    initialValues: {
      name: nftData && nftData.name,
      list_price: nftData && nftData.list_price,
      description: nftData && nftData.description,
      blurhash: nftData && nftData.blurhash,
      tags: nftData && nftData.tags,
      image: nftData && nftData.image,
      external_url: nftData && nftData.external_url,
      model_handle: nftData && nftData.model_handle,
      model_profile_pic: nftData && nftData.model_profile_pic,
      model_bnb_address: nftData && nftData.model_bnb_address,
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

  const { onAddCreatorNFTs } = useAddCreatorNFTs(
    [nftData && nftData.id],
    [Web3.utils.toWei(formik.values.list_price.toString())]
  );

  const SubmitToServer = async () => {
    try {
      setShowPendingModal(true);
      const createNFTResult = await onAddCreatorNFTs();

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

  if (!nftData) return <Loading />;

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
          title={`Editing ${formik.values.name || nftData.name}`}
          subtitle="Complete this form carefully. Make sure you don't leave this page after submitting the creation transaction."
        />

        <Form onSubmit={formik.handleSubmit}>
          <EditingNFTItem
            nftData={nftData}
            formik={formik}
            modelData={modelData}
            imageUrl={nftData.image}
            handleChange={formik.handleChange}
          />
          <div className="buttons row pt-4">
            <div className="col-md-6 mt-2 text-center">
              <Button variant="light w-100 py-2" onClick={() => router.back()}>
                <b>BACK TO DASHBOARD</b>
              </Button>
            </div>
            <div className="col-md-6  mt-2 text-center">
              <Button type="submit" variant="primary py-2 w-100">
                <b>SAVE EDITS</b>
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

CreateNFTWrapper.getInitialProps = async ({ query: { id } }) => {
  return { id };
};

export default CreateNFTWrapper;
