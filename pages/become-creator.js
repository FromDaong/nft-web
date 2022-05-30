import * as Yup from "yup";

import { Button, Text } from "@chakra-ui/react";
import {
  Form,
  FormCheck,
  FormControl,
  FormGroup,
  Spinner,
} from "react-bootstrap";
import { useContext, useEffect, useState } from "react";

import { Context } from "../contexts/TreatProvider/TreatProvider";
import Hero from "../components/Hero";
import Loading from "../components/Loading";
import { create } from "ipfs-http-client";
import dynamic from "next/dynamic";
import toBuffer from "blob-to-buffer";
import { useFormik } from "formik";
import { useMoralis } from "react-moralis";
import { useRouter } from "next/router";

const VerifyButton = dynamic(() => import("@passbase/button/react"), {
  ssr: false,
});

const client = create("https://ipfs.infura.io:5001/api/v0");

const CreateModel = () => {
  const router = useRouter();
  const [, setSuccess] = useState(false);
  const [step, setStep] = useState("loading");
  const [uploading, setUploading] = useState(false);
  const { profile } = useContext(Context);

  const formik = useFormik({
    initialValues: {
      ...profile,
      referrer_address: router.query.r,
      identity_access_key: "",
    },
    validateOnChange: false,
    validateOnBlur: false,
    enableReinitialize: true,
    validationSchema: Yup.object().shape({
      username: Yup.string().required("Please add a username"),
      bio: Yup.string().required("Please add the Creator bio"),
      model_bnb_address: Yup.string(),
      social_account: Yup.string(),
      profile_pic: Yup.string().required("Please add a Profile Photo"),
      email: Yup.string().required("Please add a Email"),
      referrer_address: Yup.string(),
      terms_accepted: Yup.boolean().oneOf([true], "Please accept the terms"),
    }),
    onSubmit: () => {
      SubmitToServer();
    },
  });

  useEffect(() => {
    for (let key in profile) {
      formik.setFieldValue(key, profile[key]);
    }
  }, [profile]);

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
        setStep("signup");
      }

      if (resJSON.success) {
        setStep("verify");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const ipfsUpload = (file, field) => {
    setUploading(true);
    toBuffer(file, (err, buff) => {
      if (err || !file) return;
      client
        .add(buff)
        .then((results) => {
          formik.setFieldValue(
            field,
            `https://treatdao.mypinata.cloud/ipfs/${results.path}`
          );
          formik.validateForm();
          setUploading(false);
        })
        .catch((err) => {
          console.log({ err });
          setUploading(false);
        });
    });
  };

  const handleVerificationFinish = async (identityAccessKey) => {
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
        setStep("pending");
      }
    } catch (error) {
      console.error(error);
    }
  };

  console.log({ formik });

  useEffect(() => {
    if (profile) {
      if (profile.rejected) {
        return setStep("rejected");
      }
      if (profile.pending && profile?.identity_access_key?.length > 0) {
        return setStep("pending");
      }
      if (profile.rejected === false && profile.pending === false) {
        return setStep("accepted");
      }
      if (profile.pending && !profile.identity_access_key) {
        return setStep("verify");
      }
      if (profile.pending && profile?.identity_access_key?.length < 1) {
        return setStep("verify");
      }
    }
    return setStep("signup");
  }, [profile]);

  if (profile === null) {
    return (
      <div
        style={{
          position: "fixed",
          width: "100%",
          height: "100%",
          display: "flex",
          top: 0,
          left: 0,
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h5
          style={{
            fontWeight: "bolder",
            background: "white",
            borderRadius: 5,
            padding: 10,
          }}
        >
          Please make sure your wallet on the Binance Smart Chain is connected.
        </h5>
        <Spinner
          animation="border"
          role="status"
          size="xl"
          style={{ marginTop: 5 }}
        >
          <span className="sr-only">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <div className="no-position" style={{ maxWidth: 800, margin: "auto" }}>
      {step === "accepted" && <Hero title="You are already a creator" />}

      {step === "rejected" && (
        <Hero title="Your application has been rejected" />
      )}

      {step === "pending" && (
        <Hero
          title="Your application has been submitted!"
          subtitle="When approved you will see a creator dashboard at the top of the navigation bar.  You can check back in a few hours."
        />
      )}

      {(step === "signup" || step === "submitting") && (
        <div className="pink-bg mb-5">
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
                    onChange={(e) => {
                      formik.setFieldValue(
                        "username",
                        e.target.value.replace(" ", "")
                      );
                      formik.validateForm();
                    }}
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
                      formik.validateForm();
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
                  {!uploading &&
                    (formik.values.profile_pic ? (
                      <div className="w-full p-3 bg-white rounded-md">
                        <Text fontWeight="bold">
                          Your profile picture has been uploaded to IPFS
                        </Text>
                        <Button
                          mt={2}
                          colorScheme="secondary"
                          size="sm"
                          onClick={() => {
                            formik.setFieldValue("");
                            formik.validateForm();
                          }}
                        >
                          Change profile picture
                        </Button>
                        <Text mt={1} color="secondary" fontSize={"sm"}>
                          {formik.values.profile_pic}
                        </Text>
                      </div>
                    ) : (
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
                    ))}
                  {uploading && (
                    <div className="w-full p-3 bg-white flex rounded-md items-center">
                      <svg
                        role="status"
                        className="inline w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-pink-600"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                          fill="currentColor"
                        />
                        <path
                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                          fill="currentFill"
                        />
                      </svg>
                      <Text>Uploading your profile picture to IFPS</Text>
                    </div>
                  )}
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
                            rel="noreferrer"
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
                    className="bg-primary text-white font-bold"
                    onClick={formik.handleSubmit}
                    disabled={!formik.dirty || !formik.isValid}
                    type="submit"
                  >
                    Submit Application
                  </Button>
                )}

                {step === "submitting" && (
                  <Button
                    className="bg-primary text-white font-bold"
                    disabled
                    isLoading
                  >
                    Submitting...
                  </Button>
                )}

                {Object.keys(formik.errors).length > 0 && (
                  <Form.Control.Feedback type="invalid" className="d-block">
                    {Object.keys(formik.errors).map((e) => (
                      <div key={e}>{formik.errors[e]}</div>
                    ))}
                    {formik.errors.code}
                  </Form.Control.Feedback>
                )}
              </div>
            </Form>
          </div>
        </div>
      )}

      {step === "verify" && (
        <div className="pink-bg mb-5">
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
                  hidestream
                  apiKey="DsPgHGsJXFzqRNFtSAL6aUkSaSYCWVHtwGKTqII6aiWma9GgMogUsxoTAFzoObi5"
                  onStart={() => null}
                  onError={() => null}
                  onFinish={handleVerificationFinish}
                />
                <small className="text-danger">
                  {formik.errors["identity_access_key"]}
                </small>
              </div>
            </div>
          </div>
        </div>
      )}

      {step === "loading" && <Loading custom={"Loading..."} />}
    </div>
  );
};

const CreateModelWrapper = (props) => {
  const { isAuthenticated } = useMoralis();

  if (!isAuthenticated) {
    return <Loading />;
  } else {
    return <CreateModel {...props} />;
  }
};

export default CreateModelWrapper;
