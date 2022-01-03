import React, { useEffect, useState } from "react";
import useSWR from "swr";
import toBuffer from "blob-to-buffer";
import {
  Button,
  FormControl,
  Form,
  FormCheck,
  FormGroup,
} from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/router";
import Hero from "../components/Hero";
import Loading from "../components/Loading";
import { create } from "ipfs-http-client";
import { useWallet } from "use-wallet";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";

const VerifyButton = dynamic(() => import("@passbase/button/react"), {
  ssr: false,
});

const client = create("https://ipfs.infura.io:5001/api/v0");

const CreateModel = () => {
  const router = useRouter();
  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState("signup");
  const { account } = useWallet();
  const { data: res } = useSWR(`/api/model/find-by-address/${account}`);

  const formik = useFormik({
    initialValues: {
      address: account,
      referrer_address: router.query.r,
      identity_access_key: "",
    },
    validateOnChange: false,
    validateOnBlur: false,
    validationSchema: Yup.object().shape({
      username: Yup.string().required("Please add a username"),
      bio: Yup.string().required("Please add the Creator bio"),
      model_bnb_address: Yup.string(),
      social_account: Yup.string().required("Please add a social account"),
      profile_pic: Yup.string().required("Please add a Profile Photo"),
      email: Yup.string().required("Please add a Email"),
      referrer_address: Yup.string(),
      terms_accepted: Yup.boolean().oneOf([true], "Please accept the terms"),
    }),
    onSubmit: (values) => {
      SubmitToServer();
    },
  });

  const SubmitToServer = async () => {
    try {
      setStep("submitting");
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
        const ogErrors = Object.assign({}, resJSON.error.errors);
        Object.keys(ogErrors).map((e) => {
          ogErrors[e] = resJSON.error.errors[e].message;
        });
        formik.setErrors(ogErrors);
        formik.setSubmitting(false);
      }

      if (resJSON.success) {
        setStep("verify");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const ipfsUpload = (file, field) => {
    toBuffer(file, (err, buff) => {
      if (err || !file) return;
      client.add(buff).then((results) => {
        formik.setFieldValue(
          field,
          `https://treatdao.mypinata.cloud/ipfs/${results.path}`
        );
      });
    });
  };

  const handleVerificationFinish = (identityAccessKey) => {
    try {
      setStep("submitting");
      const res = await fetch(`/api/model/${res.username}`, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identity_access_key: identityAccessKey,
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
        setSuccess(true);
        setStep("signup");
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (success || (res && res.pending && res.identity_access_key.length > 0))
    return (
      <Hero
        title="Your application has been submitted!"
        subtitle="When approved you will see a creator dashboard at the top of the navigation bar.  You can check back in a few hours."
      />
    );

  if (res && res.rejected)
    return <Hero title="Your application has been rejected" />;

  useEffect(() => {
    if (res && res.identity_access_key.length === 0) {
      setStep("verify");
    }
  }, [res]);

  return (
    <div className="no-position" style={{ maxWidth: 800, margin: "auto" }}>
      {(step === "signup" || step === "submitting") && (
        <motion.div
          animate={{ y: 0, opacity: 1 }}
          style={{ y: -100, opacity: 0 }}
          transition={{ delay: 0.25 }}
          className="pink-bg mb-5"
        >
          <Hero
            title="Become a Creator"
            subtitle="Complete the form below to apply to become a creator. Creators are able to mint NFTs on TreatDAO!"
          />
          <div
            className="container p-4 pb-0 white-tp-container-no-filter"
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
                    onChange={(e) =>
                      formik.setFieldValue(
                        "username",
                        e.target.value.replace(" ", "")
                      )
                    }
                  />
                  <small>treatdao.com/creator/{formik.values.username}</small>
                </div>

                <div className="pb-3">
                  <label>Profile bio / about you</label>
                  <FormControl
                    as="textarea"
                    name="bio"
                    value={formik.values.bio}
                    onChange={formik.handleChange}
                  />
                  <small>
                    {formik.values.bio ? formik.values.bio.length : 0} / 1000
                  </small>
                </div>
                <div className="pb-4 pt-1">
                  <label>Email:</label>

                  <FormControl
                    name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                  />
                </div>
                <div className="pb-4 pt-1">
                  <label>Referrer address (optional):</label>
                  <FormControl
                    name="referrer_address"
                    value={formik.values.referrer_address}
                    onChange={formik.handleChange}
                  />
                  <small>
                    If someone referred you to Treat, put their wallet address
                    here so they are rewarded.
                  </small>
                </div>
                <div className="pb-4">
                  <label>URL / Link to an existing social account</label>
                  <FormControl
                    placeholder="https://twitter.com/alexanbt"
                    name="social_account"
                    value={formik.values.social_account}
                    onChange={(e) => {
                      let value = e.target.value;
                      const regex = new RegExp(
                        /(\S+\.(com|net|org|edu|gov)(\/\S+)?)/
                      );

                      if (value.match(regex)) {
                        if (!value.startsWith("http")) {
                          value = `https://${value}`;
                        }
                      }
                      formik.setFieldValue("social_account", value);
                    }}
                  />
                  <small className="text-danger">
                    {formik.errors["social_account"]}
                  </small>
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

                <div className="pb-4">
                  <FormGroup>
                    <FormCheck>
                      <Form.Check.Input
                        type="checkbox"
                        isValid={formik.values.terms_accepted}
                        onChange={(e) =>
                          formik.setFieldValue(
                            "terms_accepted",
                            e.target.checked
                          )
                        }
                      />
                      <FormCheck.Label>
                        <label className="black">
                          I agree to the{" "}
                          <a
                            href="https://drive.google.com/file/d/1Li5EAK8sP71rY1wT9J87mUCjLWmjcO2a/view?usp=sharing"
                            style={{
                              color: "inherit",
                              textDecoration: "underline",
                            }}
                            target="_blank"
                          >
                            terms of service.
                          </a>
                        </label>
                      </FormCheck.Label>
                    </FormCheck>
                    <small className="text-danger">
                      {formik.errors["terms_accepted"]}
                    </small>
                  </FormGroup>
                </div>

                {step === "signup" && (
                  <Button
                    variant="primary w-100"
                    onClick={formik.handleSubmit}
                    type="submit"
                  >
                    Submit Application
                  </Button>
                )}

                {step === "submitting" && (
                  <Button variant="primary w-100 disabled" onClick={null}>
                    Submitting...
                  </Button>
                )}

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
        </motion.div>
      )}

      {step === "verify" && (
        <motion.div
          animate={{ y: 0, opacity: 1 }}
          style={{ y: -100, opacity: 0 }}
          transition={{ delay: 0.25 }}
          className="pink-bg mb-5"
        >
          <Hero
            title="Verfiy your identity"
            subtitle="Verfiy your identity to complete your creator application. Creators are able to mint NFTs on TreatDAO!"
          />
          <div
            className="container p-4 pb-0 white-tp-container-no-filter"
            style={{ borderRadius: 10 }}
          >
            <div className="pb-4">
              <div className="pb-4 pt-2 verify-container">
                <label>Click the button below to verify your identity</label>

                <VerifyButton
                  id="asd"
                  // hidestream
                  apiKey="zYe9VHCjf5z2MoiuQGlvRK3KRPmQ0B7Kaghp6qyFZ8PfTnQa0zFRuZZWgoVGeAVX"
                  onStart={() => {}}
                  onError={(errorCode) => {}}
                  onFinish={handleVerificationFinish}
                />
                <small className="text-danger">
                  {formik.errors["identity_access_key"]}
                </small>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
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
