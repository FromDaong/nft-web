import * as Yup from "yup";

import { InfoCircleFill } from "react-bootstrap-icons";
import { ListGroup } from "react-bootstrap";
import Web3 from "web3";
import { create } from "ipfs-http-client";
import useEditSubscription from "../../hooks/useEditSubscription";
import { useFormik } from "formik";
import useGetSubscriptionCost from "../../hooks/useGetSubscriptionCost";
import { useMoralis } from "react-moralis";
import { useRouter } from "next/router";
import useSWR from "swr";
import { useState } from "react";

const client = create("https://ipfs.infura.io:5001/api/v0");

const EditProfile = () => {
  const [showPendingModal, setShowPendingModal] = useState(null);
  const [showCompleteModal, setShowCompleteModal] = useState(null);
  const router = useRouter();
  const { account } = useMoralis();
  const subscriptionCost = useGetSubscriptionCost(account);
  const { data: res } = useSWR(`/api/model/find-by-address/${account}`);

  const formik = useFormik({
    initialValues: {
      price:
        subscriptionCost && Web3.utils.fromWei(subscriptionCost.toString()),
      subscription_description:
        res.subscription && res.subscription.description,
    },
    validateOnChange: false,
    validateOnBlur: false,
    enableReinitialize: true,
    validationSchema: Yup.object().shape({
      price: Yup.string().required("Please add a price"),
      subscription_description: Yup.string(),
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
    onEditSubscription()
      .then((s) => {
        setShowPendingModal(false);
        if (s) {
          setShowCompleteModal(true);
        }
      })
      .catch((e) => console.log({ e }));
  };

  return (
    <div className="white-tp-bg" style={{ minHeight: 200 }}>
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
            <InfoCircleFill className="pb-1 mr-1" /> Creator Resources
          </h2>
        </div>
      </div>
      <div className="p-4">
        <ListGroup defaultActiveKey="#link1">
          <ListGroup.Item
            action
            target="_blank"
            href="https://drive.google.com/file/d/1B0Q1Jkja4a2LsPrUTaS-ANNnD7m_jqQD/view?usp=sharing"
          >
            Creator's Guide
          </ListGroup.Item>
          <ListGroup.Item
            action
            target="_blank"
            href="https://drive.google.com/file/d/1Li5EAK8sP71rY1wT9J87mUCjLWmjcO2a/view"
          >
            Content Creator Agreement
          </ListGroup.Item>
          <ListGroup.Item
            action
            target="_blank"
            href="https://t.me/TreatContentCreators"
          >
            Creator Community Telegram
          </ListGroup.Item>
          <ListGroup.Item
            action
            target="_blank"
            href="https://drive.google.com/file/d/1V17GZVo2HA8T9zrrmG4690j-0h4IPWwN/view?usp=sharing"
          >
            Explainer Guide
          </ListGroup.Item>
          <ListGroup.Item
            action
            target="_blank"
            href="https://drive.google.com/file/d/1wZYC_Lj-MWxvJhw86BzGLHIbWOqADRvL/view?usp=sharing"
          >
            Beginner Tips
          </ListGroup.Item>
          <ListGroup.Item
            action
            target="_blank"
            href="https://docs.google.com/gview?url=https://github.com/TreatDAO/litepaper/raw/main/TreatPaperFinal.pdf&embedded=true"
          >
            Litepaper
          </ListGroup.Item>
        </ListGroup>
      </div>
    </div>
  );
};

export default EditProfile;
