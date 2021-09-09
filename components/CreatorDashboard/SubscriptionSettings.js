import React, { useEffect, useState } from "react";
import useSWR from "swr";
import Web3 from "web3";
import { Button, InputGroup, FormControl, Form } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/router";
import Hero from "../../components/Hero";
import BlankModal from "../../components/BlankModal";
import useEditSubscription from "../../hooks/useEditSubscription";
import useGetSubscriptionCost from "../../hooks/useGetSubscriptionCost";
import { create } from "ipfs-http-client";
import { useWallet } from "use-wallet";
import { GearFill } from "react-bootstrap-icons";

const client = create("https://ipfs.infura.io:5001/api/v0");

const EditProfile = ({}) => {
  const [showPendingModal, setShowPendingModal] = useState(null);
  const [showCompleteModal, setShowCompleteModal] = useState(null);
  const router = useRouter();
  const { account } = useWallet();
  const subscriptionCost = useGetSubscriptionCost(account);
  const { data: res } = useSWR(`/api/model/find-by-address/${account}`);

  const formik = useFormik({
    initialValues: {
      enabled: res.subscription && res.subscription.enabled,
      price: subscriptionCost,
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

  const weiPrice = Web3.utils.toWei((formik.values.price || 0).toString());
  const { onEditSubscription } = useEditSubscription(weiPrice);

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

  const setSubscriptionPrice = () => {
    setShowPendingModal(true);
    onEditSubscription().then((s) => {
      setShowPendingModal(false);
      if (s) {
        setShowCompleteModal(true);
      }
    });
  };

  return (
    <div className="white-tp-bg" style={{ minHeight: 400 }}>
      <BlankModal
        show={!!showPendingModal}
        handleClose={() => setShowPendingModal(false)}
        title={"Waiting for Transaction Confirmation ⌛"}
        subtitle={
          "Please confirm this transaction in your wallet and wait here for upto a few minutes for the transaction to confirm..."
        }
        noButton={true}
        account={account}
      />
      <BlankModal
        show={!!showCompleteModal}
        handleClose={() => setShowCompleteModal(false)}
        account={account}
      />
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
              <label>Subscription Price in BNB</label>
              <FormControl
                placeholder="E.g. alexanbt"
                name="price"
                value={formik.values.price}
                onChange={formik.handleChange}
              />
              <small>
                Price for 30 day subscription. Use 0.00 BNB to deactivate
                subscriptions.
              </small>
            </div>
            <Button
              variant="primary w-100 mb-3"
              onClick={setSubscriptionPrice}
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
