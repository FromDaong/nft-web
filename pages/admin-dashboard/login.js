import React, { useState } from "react";
import { Button, InputGroup, FormControl, Form } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/router";
import Hero from "../../components/Hero";
import Link from "next/link";

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
      master_password: Yup.string().required("Please add the master password"),
    }),
    onSubmit: (values) => {
      SubmitToServer();
    },
  });

  const SubmitToServer = async () => {
    try {
      const res = await fetch(`/api/admin/login`, {
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
      } else if (resJSON.error && !resJSON.error.errors) {
        alert(resJSON.error);
      }

      if (resJSON.success) {
        setSuccess(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (success)
    return (
      <div>
        <Hero
          title={"Successfully authenticated"}
          subtitle={"Welcome back, Sir / Madame."}
          additionalContent={
            <Link href="/admin-dashboard">
              <a>
                <Button variant="primary  w-sm-100">
                  <b>{"Back to admin panel"}</b>
                </Button>
              </a>
            </Link>
          }
        />
      </div>
    );

  return (
    <>
      <Hero
        title={"Login to Admin Dashboard"}
        subtitle={"For use for limited number of individuals"}
      />
      <div
        className="container mt-5 px-5 pb-5 py-4 white-tp-container"
        style={{ borderRadius: 10 }}
      >
        <Form onSubmit={formik.handleSubmit}>
          <div className="pb-4">
            <label>Master Password</label>
            <FormControl
              type="password"
              placeholder="Ask a friend"
              name="master_password"
              value={formik.values.master_password}
              onChange={formik.handleChange}
            />
          </div>
          <Button variant="primary" onClick={formik.handleSubmit} type="submit">
            <b>Login</b>
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
    </>
  );
};

export default CreateNFT;
