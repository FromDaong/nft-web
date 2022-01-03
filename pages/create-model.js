import React, { useState } from "react";
import { Button, InputGroup, FormControl, Form } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/router";

const CreateModel = () => {
  const router = useRouter();
  const [success, setSuccess] = useState(false);

  const formik = useFormik({
    initialValues: {
      external_url: "https://treatdao.com/",
    },
    validateOnChange: false,
    validateOnBlur: false,
    validationSchema: Yup.object().shape({
      username: Yup.string().required("Please add a username"),
      bio: Yup.string().required("Please add the Model bio"),
      profile_pic: Yup.string().required("Please add a profile_pic"),
      master_password: Yup.string().required("Please add the master password"),
    }),
    onSubmit: (values) => {
      SubmitToServer();
    },
  });

  const SubmitToServer = async () => {
    try {
      const res = await fetch(`/api/model/create`, {
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
        setSuccess(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (success) return <div>Success.</div>;

  return (
    <div
      className="container mt-5 px-5 pb-5 pt-4 mb-5"
      style={{ background: "#fffdf2", borderRadius: 10 }}
    >
      <h1 className="pb-3">
        <b>Create New Model</b>
      </h1>

      {/* <h6 className="pb-3">
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
      </h6> */}

      <Form onSubmit={formik.handleSubmit}>
        <div className="pb-4">
          <div className="pb-4">
            <label>Model Username (unique)</label>
            <FormControl
              placeholder="E.g. alexanbt"
              name="username"
              value={formik.values.username}
              onChange={formik.handleChange}
            />
          </div>
          <div className="pb-4">
            <label>Model Bio</label>
            <FormControl
              placeholder="E.g. 120"
              name="bio"
              value={formik.values.bio}
              onChange={formik.handleChange}
            />
          </div>
          <div className="pb-4">
            <label>Model Profile Pic</label>
            <FormControl
              placeholder="E.g. https://img.ur/123"
              name="profile_pic"
              value={formik.values.profile_pic}
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
            Create Model
          </Button>
          <Form.Control.Feedback
            type="invalid"
            className="d-block"
            style={{ marginTop: -10 }}
          >
            {formik.errors.code}
          </Form.Control.Feedback>
        </div>
      </Form>
    </div>
  );
};

export default CreateModel;
