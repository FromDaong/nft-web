import React, { useEffect, useState } from "react";
import useSWR from "swr";
import toBuffer from "blob-to-buffer";
import { Button, InputGroup, FormControl, Form } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/router";
import Hero from "../../components/Hero";
import Loading from "../../components/Loading";
import { create } from "ipfs-http-client";
import { useWallet } from "use-wallet";
import { GearFill } from "react-bootstrap-icons";

const client = create("https://ipfs.infura.io:5001/api/v0");

const EditProfile = ({}) => {
  const router = useRouter();
  const { account } = useWallet();
  const { data: res } = useSWR(`/api/model/find-by-address/${account}`);
  const [success, setSuccess] = useState(false);

  console.log({ res });

  const formik = useFormik({
    initialValues: {
      enabled: res.subscription && res.subscription.enabled,
      price: res.subscription && res.subscription.price,
      description: res.subscription && res.subscription.description,
    },
    validateOnChange: false,
    validateOnBlur: false,
    validationSchema: Yup.object().shape({
      price: Yup.string().required("Please add a price"),
      description: Yup.string(),
    }),
    onSubmit: (values) => {
      SubmitToServer();
    },
  });

  const SubmitToServer = async () => {
    try {
      const serverRes = await fetch(`/api/model/${res.username}`, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formik.values),
      });
      const resJSON = await serverRes.json();

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
        router.reload();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const ipfsUpload = (file, field) => {
    toBuffer(file, (err, buff) => {
      console.log({ err, file });
      if (err || !file) return;
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
        subtitle="When approved you will see a creator dashboard at the top of the navigation bar.  You can check back in a few hours."
      />
    );

  if (res && res.rejected)
    return <Hero title="Your application has been rejected" />;

  return (
    <div className="white-tp-bg" style={{ minHeight: 400 }}>
      <div
        className="px-4 py-2 w-100 d-flex"
        style={{
          background: "#FFFDF2",
          justifyContent: "space-between",
          alignItems: "center",
          borderRadius: 8,
        }}
      >
        <div>
          <h2
            className="heading-text-primary pt-1"
            style={{
              fontSize: 24,
            }}
          >
            <GearFill className="pb-1 mr-1" /> Subscription Settings
          </h2>
        </div>
      </div>
      <div className="col-sm-12 pt-3">
        <Form onSubmit={formik.handleSubmit}>
          <div className="pb-4">
            <div className="pb-4">
              <label>Subscription Price in BNB (30 days)</label>
              <FormControl
                placeholder="E.g. alexanbt"
                name="username"
                value={formik.values.price}
                onChange={formik.handleChange}
              />
            </div>
            <Button
              variant="primary w-100 mb-3"
              onClick={formik.handleSubmit}
              type="submit"
            >
              Update Subscription Price
            </Button>
            <div className="pb-3">
              <label>Subscription description</label>
              <FormControl
                as="textarea"
                name="bio"
                value={formik.values.bio}
                onChange={formik.handleChange}
              />
              <small>
                Explain what subscribers can expect from their subscription.
                E.g. How regularly you will post new content
              </small>
            </div>
            <Button
              variant="primary w-100"
              onClick={formik.handleSubmit}
              type="submit"
            >
              Update Subscription Description
            </Button>
            {Object.keys(formik.errors).length > 0 && (
              <Form.Control.Feedback type="invalid" className="d-block">
                {Object.keys(formik.errors).map((e) => (
                  <div>{formik.errors[e]}</div>
                ))}
                {formik.errors.code}
              </Form.Control.Feedback>
            )}
          </div>
        </Form>
      </div>
    </div>
  );
};

export default EditProfile;
