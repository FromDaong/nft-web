import React, { useState } from "react";
import { Button, InputGroup, FormControl, Form } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/router";

const CreateNFT = () => {
  const router = useRouter();
  const [success, setSuccess] = useState(false);

  const formik = useFormik({
    initialValues: {
      external_url: "https://treatdao.com/",
    },
    validateOnChange: false,
    validateOnBlur: false,
    validationSchema: Yup.object().shape({
      id: Yup.number().required("Please add a nft id"),
      name: Yup.string().required("Please add a name"),
      list_price: Yup.string().required("Please add the NFT list price"),
      description: Yup.string(),
      external_url: Yup.string().required("Please add a external_url"),
      blurhash: Yup.string().required("Please add a blurhash"),
      image: Yup.string().required("Please add a image"),
      max_supply: Yup.string().required("Please add a max supply"),
      model_handle: Yup.string().required("Please add a model handle"),
      model_profile_pic: Yup.string().required(
        "Please add a model profile pic"
      ),
      model_bnb_address: Yup.string().required(
        "Please add the model bnb address"
      ),
      master_password: Yup.string().required("Please add the master password"),
    }),
    onSubmit: (values) => {
      SubmitToServer();
    },
  });

  const SubmitToServer = async () => {
    try {
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
    <div
      className="container mt-5 px-5 pb-5 pt-4 mb-5"
      style={{ background: "#fffdf2", borderRadius: 10 }}
    >
      <h1 className="pb-3">
        <b>Create New NFT</b>
      </h1>

      <h6 className="pb-3">
        Step 1: Add image to IPFS storage and grab URL{" "}
        <a
          href="https://ipfs.talaikis.com/"
          target="_blank"
          style={{ color: "blue" }}
        >
          <b>using this tool</b>
        </a>
      </h6>
      <h6 className="pb-3">
        Step 2: Get BlurHash.{" "}
        <a href="https://blurha.sh/" target="_blank" style={{ color: "blue" }}>
          <b>
            Scroll to "Upload" button, upload image and copy BlurHash string.
          </b>
        </a>
      </h6>

      <Form onSubmit={formik.handleSubmit}>
        <div className="pb-4">
          <label>NFT Identifier (ID)</label>
          <FormControl
            placeholder="Should be an increment of the last ID. (E.g. 3)"
            name="id"
            value={formik.values.id}
            onChange={formik.handleChange}
          />
        </div>
        <div className="pb-4">
          <label>NFT Name</label>
          <FormControl
            placeholder="E.g. Morning Wood"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
          />
        </div>
        <div className="pb-4">
          <label>NFT List Price (in BNB)</label>
          <FormControl
            placeholder="E.g. 120"
            name="list_price"
            value={formik.values.list_price}
            onChange={formik.handleChange}
          />
        </div>
        <div className="pb-4">
          <label>NFT Description</label>
          <FormControl
            placeholder="E.g. Let's make you rise."
            name="description"
            value={formik.values.description}
            onChange={formik.handleChange}
          />
        </div>
        <div className="pb-4">
          <label>External URL</label>
          <FormControl
            placeholder=""
            name="external_url"
            value={formik.values.external_url}
            onChange={formik.handleChange}
          />
        </div>
        <div className="pb-4">
          <label>Image URL from Step 1</label>
          <FormControl
            placeholder="E.g. https://ipfs.infura.io:5001/api/v0/cat/QmeoFDJFqCxjpZB5123wVDuzKSCAd7C2bZCGDKKLQLRU7R4U"
            name="image"
            value={formik.values.image}
            onChange={formik.handleChange}
          />
        </div>
        <div className="pb-4">
          <label>BlurHash String from Step 2</label>
          <FormControl
            placeholder="E.g. eKO2?U%2Tw=wR6]~RBVZRip0};RPxuwH%3tLOtxZ%gixI.ENa0NZIV"
            name="blurhash"
            value={formik.values.blurhash}
            onChange={formik.handleChange}
          />
        </div>
        <div className="pb-4">
          <label>Maximum Supply</label>
          <FormControl
            placeholder="E.g. 1500"
            name="max_supply"
            value={formik.values.max_supply}
            onChange={formik.handleChange}
          />
        </div>
        <div className="pb-4">
          <label>Model Social Handle</label>
          <FormControl
            placeholder="E.g. @TreatDAO"
            name="model_handle"
            value={formik.values.model_handle}
            onChange={formik.handleChange}
          />
        </div>
        <div className="pb-4">
          <label>Model Profile Pic URL</label>
          <FormControl
            placeholder="E.g. https://twitter.com/treatdao/photo"
            name="model_profile_pic"
            value={formik.values.model_profile_pic}
            onChange={formik.handleChange}
          />
        </div>
        <div className="pb-4">
          <label>Model BNB Address for Recieving Payment</label>
          <FormControl
            placeholder="E.g. 0x123"
            name="model_bnb_address"
            value={formik.values.model_bnb_address}
            onChange={formik.handleChange}
          />
        </div>
        <div className="pb-4">
          <label>Master Password</label>
          <FormControl
            placeholder="Ask a friend"
            name="master_password"
            value={formik.values.master_password}
            onChange={formik.handleChange}
          />
        </div>
        <Button
          variant="primary w-100"
          onClick={formik.handleSubmit}
          type="submit"
        >
          Create NFT
        </Button>
        <Form.Control.Feedback
          type="invalid"
          className="d-block"
          style={{ marginTop: -10 }}
        >
          {formik.errors.code}
        </Form.Control.Feedback>
      </Form>
    </div>
  );
};

export default CreateNFT;
