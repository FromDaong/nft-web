import React, { useEffect, useState } from "react";
import useSWR from "swr";
import toBuffer from "blob-to-buffer";
import { Button, InputGroup, FormControl, Form } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/router";
import Hero from "../components/Hero";
import Loading from "../components/Loading";
import { create } from "ipfs-http-client";
import { useWallet } from "use-wallet";

const client = create("https://ipfs.infura.io:5001/api/v0");

const CreateModel = () => {
  const router = useRouter();
  const [success, setSuccess] = useState(false);
  const { account } = useWallet();
  const { data: res } = useSWR(`/api/model/find-by-address/${account}`);

  const formik = useFormik({
    initialValues: {
      address: account,
    },
    validateOnChange: false,
    validateOnBlur: false,
    validationSchema: Yup.object().shape({
      username: Yup.string().required("Please add a username"),
      bio: Yup.string().required("Please add the Creator bio"),
      model_bnb_address: Yup.string(),
      social_account: Yup.string(),
      profile_pic: Yup.string().required("Please add a Profile Photo"),
      email: Yup.string().required("Please add a Email"),
    }),
    onSubmit: (values) => {
      SubmitToServer();
    },
  });

  const SubmitToServer = async () => {
    try {
      console.log({ 1: 1 });
      const res = await fetch(`/api/model/become`, {
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

  const ipfsUpload = (file, field) => {
    toBuffer(file, (err, buff) => {
      console.log({ err, file });
      if (err) return;
      client.add(buff).then((results) => {
        console.log("=> IPFS Dropzone added: ", results);
        formik.setFieldValue(
          field,
          `https://ipfs.infura.io/ipfs/${results.path}`
        );
      });
    });
  };

  console.log({ res });

  if (success || (res && res.pending))
    return (
      <Hero
        title="Your application has been submitted!"
        subtitle="Check back here in a few days to see if the creator 'dashboard', has appeared at the top in the navigation bar!"
      />
    );

  if (res && res.rejected)
    return <Hero title="Your application has been rejected" />;

  return (
    <>
      <Hero
        title="Become a Creator"
        subtitle="Complete the form below to apply to become a creator. Creators are able to mint NFTs on TreatDAO!"
      />
      <div
        className="container mt-5 px-5 py-4 mb-5 white-tp-container"
        style={{ borderRadius: 10 }}
      >
        <Form onSubmit={formik.handleSubmit}>
          <div className="pb-4">
            <div className="pb-4">
              <label>Username</label>
              <FormControl
                placeholder="E.g. alexanbt"
                name="username"
                value={formik.values.username}
                onChange={formik.handleChange}
              />
            </div>
            <div className="pb-4">
              <label>Profile bio / about you</label>
              <FormControl
                name="bio"
                value={formik.values.bio}
                onChange={formik.handleChange}
              />
            </div>
            <div className="pb-4">
              <label>URL / Link to an existing social account (optional)</label>
              <FormControl
                placeholder="https://twitter.com/alexanbt"
                name="social_account"
                value={formik.values.social_account}
                onChange={formik.handleChange}
              />
            </div>
            <div className="pb-4">
              <label className="m-0">Profile Picture</label>
              <br />
              <small>
                Please ensure photo is square, 1000 x 1000 recommended.
              </small>
              <FormControl
                type="file"
                size="lg"
                placeholder="E.g. https://img.ur/123"
                name="profile_pic"
                className="bg-white p-3 rounded"
                // value={formik.values.profile_pic}
                onChange={(file) =>
                  ipfsUpload(file.target.files[0], "profile_pic")
                }
              />
            </div>
            <div className="pb-5 pt-2">
              <label>Email:</label>

              <FormControl
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
              />
              {/* <FormControl
                type="file"
                size="lg"
                placeholder="E.g. https://img.ur/123"
                name="verification_photo"
                className="bg-white p-3 rounded"
                // value={formik.values.verification_photo}
                onChange={(file) =>
                  ipfsUpload(file.target.files[0], "verification_photo")
                }
              /> */}
            </div>
            <Button
              variant="primary w-100"
              onClick={formik.handleSubmit}
              type="submit"
            >
              Submit Application
            </Button>
            <Form.Control.Feedback type="invalid" className="d-block">
              {Object.keys(formik.errors).map((e) => (
                <div>{formik.errors[e]}</div>
              ))}
              {formik.errors.code}
            </Form.Control.Feedback>
          </div>
        </Form>
      </div>
    </>
  );
};

const CreateModelWrapper = (props) => {
  const { account, status } = useWallet();

  if (status !== "connected") {
    return <Loading />;
  } else {
    return <CreateModel {...props} />;
  }
};

export default CreateModelWrapper;
