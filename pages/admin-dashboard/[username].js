import React, { useState, useEffect } from "react";
import Spinner from "react-bootstrap/Spinner";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import useWallet from "use-wallet";
import useSWR from "swr";
import Link from "next/link";
import Layout from "../../components/Layout";
import BlankModal from "../../components/BlankModal";
import useAddPerformerToMinter from "../../hooks/useAddPerformerToMinter";
import useRemovePerformerFromMinter from "../../hooks/useRemovePerformerFromMinter";
import Hero from "../../components/Hero";

const AdminDashboardWrapper = ({ username }) => {
  const { account, status } = useWallet();

  const { data } = useSWR(`/api/admin/is-authed`);

  if (status !== "connected" || !data) {
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
  } else {
    if (data.failed)
      return (
        <Hero
          title={"You are not authenticated."}
          subtitle={"You are not permitted to use this dashboard"}
          additionalContent={
            <Link href="/admin-dashboard/login">
              <Button variant="primary  w-sm-100">
                <b>{"Login to Panel"}</b>
              </Button>
            </Link>
          }
        />
      );
    return <AdminDashboard username={username} />;
  }
};

const AdminDashboard = ({ username }) => {
  const { data } = useSWR(`/api/admin/get-info/${username}`);
  const [showPendingModal, setShowPendingModal] = useState(null);
  const [showCompleteModal, setShowCompleteModal] = useState(null);
  const { onAddPerformerToMinter } = useAddPerformerToMinter(
    data && data.address
  );
  const { onRemovePerformerFromMinter } = useRemovePerformerFromMinter(
    data && data.address
  );

  if (!data)
    return (
      <Hero
        title={`Loading: ${username}'s application...`}
        additionalContent={
          <Link href="/admin-dashboard">
            <Button variant="primary  w-sm-100">
              <b>{"Back to admin panel"}</b>
            </Button>
          </Link>
        }
      />
    );

  const addPerformerToMinter = async () => {
    setShowPendingModal(true);
    const performer = await onAddPerformerToMinter();
    if (performer) {
      const res = await fetch(`/api/admin/${username}/approve`);
      setShowCompleteModal(true);
    }
    setShowPendingModal(false);
  };

  const reject = async () => {
    setShowPendingModal(true);
    const performer = await onRemovePerformerFromMinter();
    if (performer) {
      const res = await fetch(`/api/admin/${username}/reject`);
      setShowCompleteModal(true);
    }
    setShowPendingModal(false);
  };

  return (
    <Layout>
      <BlankModal
        show={!!showPendingModal}
        handleClose={() => setShowPendingModal(false)}
        title={"Confirming Transaction ⌛ - Don't close this browser window"}
        centered
        subtitle={
          "Please confirm this transaction in your wallet and wait here for upto a few minutes for the transaction to confirm. Do not close this browser window!"
        }
        noButton={true}
      />
      <BlankModal
        show={!!showCompleteModal}
        handleClose={() => setShowCompleteModal(false)}
      />

      <div className="container my-nft-container">
        <Hero
          title={`Reviewing: ${username}'s application`}
          subtitle={`Be super careful when approving and rejecting creators`}
          additionalContent={
            <Link href="/admin-dashboard">
              <Button variant="primary  w-sm-100">
                <b>{"Back to admin panel"}</b>
              </Button>
            </Link>
          }
        />
        {/* <div className="white-tp-bg mt-4 p-3">
          <p className="w-100 mb-0" style={{ wordBreak: "break-word" }}>
            <b>Connected wallet address:</b>
            <div>{`${account}`}</div>
          </p>
        </div> */}

        <div className="mt-2 white-tp-container pb-3">
          <div className="row">
            <h5 className="col-md-6 pb-3">
              <b>Username:</b>
              <br />
              {data.username}
            </h5>
            <h5 className="col-md-6 pb-3">
              <b>Bio:</b>
              <br />
              {data.bio}
            </h5>
          </div>
          <div className="row">
            <h5 className="col-md-6 pb-3">
              <b>Address:</b>
              <br />
              {data.address}
            </h5>
            <h5 className="col-md-6 pb-3">
              <b>Submitted at:</b>
              <br />
              {new Date(data.createdAt).toLocaleString()}
            </h5>
          </div>
          <div className="row">
            <h5 className="col-md-12 pb-3">
              <b>Social Profile:</b>
              <br />
              <a href={data.social_account}>{data.social_account}</a>
            </h5>
          </div>
          <div className="row">
            <h5 className="col-md-6 pb-3">
              <b>Profile Pic:</b>
              <br />
              <img
                src={data.profile_pic}
                style={{ width: 350, marginTop: 5 }}
                className="rounded"
              />
            </h5>
            <h5 className="col-md-6 pb-3">
              <b>Verification Photo:</b>
              <br />
              <img
                src={data.verification_photo}
                style={{ width: 350, marginTop: 5 }}
                className="rounded"
              />
            </h5>
            <h5 className="col-md-6 pb-3">
              <b>Pending review:</b>
              <br />
              {data.pending.toString()}
            </h5>
            <h5 className="col-md-6 pb-3">
              <b>Rejected:</b>
              <br />
              {data.rejected.toString()}
            </h5>
          </div>

          <div className="buttons row py-2">
            <div className="col-md-6 mt-2 text-center">
              <Button
                variant="success w-100 py-2"
                onClick={() => addPerformerToMinter()}
              >
                <b>APPROVE</b>
              </Button>
            </div>
            <div className="col-md-6  mt-2 text-center">
              <Button variant="danger py-2 w-100" onClick={() => reject()}>
                <b>REJECT</b>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

AdminDashboardWrapper.getInitialProps = async ({ query: { username } }) => {
  return { username };
};

export default AdminDashboardWrapper;
