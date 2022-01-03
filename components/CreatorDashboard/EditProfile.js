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
import { PencilFill } from "react-bootstrap-icons";
import axios from "axios";

const client = create("https://ipfs.infura.io:5001/api/v0");

const EditProfile = ({}) => {
  const router = useRouter();
  const { account } = useWallet();
  const { data: res } = useSWR(`/api/model/find-by-address/${account}`);
  const [success, setSuccess] = useState(false);
  const [disabled, setDisabled] = useState(false);


  const formik = useFormik({
    initialValues: res,
    validateOnChange: false,
    validateOnBlur: false,
    validationSchema: Yup.object().shape({
      display_name: Yup.string(),
      username: Yup.string().required("Please add a username"),
      bio: Yup.string().required("Please add the Creator bio"),
      social_account: Yup.string(),
      profile_pic: Yup.string().required("Please add a Profile Photo"),
      banner_pic: Yup.string(),
      email: Yup.string().required("Please add a Email"),
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
        console.error(resJSON.error);
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
      console.error(error);
    }
  };

  const ipfsUpload = (file, field) => {
    setDisabled(true);

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
      .then(function (response) {
        console.error({ response });
        formik.setFieldValue(
          field,
          `https://treatdao.mypinata.cloud/ipfs/${response.data.IpfsHash}`
        );
        setDisabled(false);
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
            <PencilFill className="pb-1 mr-1" /> Edit Profile
          </h2>
        </div>
      </div>
      <div className="col-sm-12 pt-3">
        <Form onSubmit={formik.handleSubmit}>
          <div className="pb-4">
            <div className="pb-4">
              <label>Display Name</label>
              <FormControl
                placeholder="E.g. Alena"
                name="display_name"
                value={formik.values.display_name}
                onChange={formik.handleChange}
              />
              <small>Displayed on your profile.</small>
            </div>

            <div className="pb-4">
              <label>Username</label>
              <FormControl
                placeholder="E.g. alexanbt"
                name="username"
                value={formik.values.username}
                onChange={formik.handleChange}
              />
              <small>
                https://treatdao.com/creator/{formik.values.username}
              </small>
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
              <label className="m-0">Change Profile Picture</label>
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
              <label className="m-0">Change Banner Photo</label>
              <br />
              <small>1080 x 240 recommended.</small>
              <FormControl
                type="file"
                size="lg"
                placeholder="E.g. https://img.ur/123"
                name="profile_pic"
                className="bg-white p-3 rounded"
                // value={formik.values.profile_pic}
                onChange={(file) =>
                  ipfsUpload(file.target.files[0], "banner_pic")
                }
              />
            </div>
            <Button
              variant="primary w-100"
              onClick={formik.handleSubmit}
              disabled={disabled}
              type="submit"
            >
              Update Profile
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
