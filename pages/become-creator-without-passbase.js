import * as Yup from "yup";

import { Button, Form, FormControl } from "react-bootstrap";

import Hero from "../components/Hero";
import Loading from "../components/Loading";
import { create } from "ipfs-http-client";
// import VerifyButton from "@passbase/button/react";
import dynamic from "next/dynamic";
import toBuffer from "blob-to-buffer";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import useSWR from "swr";
import { useState } from "react";
import { useWallet } from "use-wallet";

const VerifyButton = dynamic(() => import("@passbase/button/react"), {
  ssr: false,
});

const client = create("https://ipfs.infura.io:5001/api/v0");

const CreateModel = () => {
  const router = useRouter();
  const [success, setSuccess] = useState(false);
  const { account } = useMoralis();
  const { data: res } = useSWR(`/api/model/find-by-address/${account}`);

  const formik = useFormik({
    initialValues: {
      address: account,
      referrer_address: router.query.r,
      // identity_access_key: "asd",
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
      referrer_address: Yup.string(),
      identity_access_key: Yup.string(),
    }),
    onSubmit: (values) => {
      SubmitToServer();
    },
  });

  const SubmitToServer = async () => {
    try {
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
        console.error(resJSON.error);
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
    <div className="no-position" style={{ maxWidth: 800, margin: "auto" }}>
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
                onChange={formik.handleChange}
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
                If someone referred you to Treat, put their wallet address here
                so they are rewarded.
              </small>
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
            <div className="pb-4">
              <label>URL / Link to an existing social account</label>
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
            <Button
              variant="primary w-100"
              onClick={formik.handleSubmit}
              type="submit"
            >
              Submit Application
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

const CreateModelWrapper = (props) => {
  const { account, status } = useWallet();

  if (status !== "connected") {
    return <Loading />;
  } else {
    return <CreateModel {...props} />;
  }
};

export default CreateModelWrapper;
