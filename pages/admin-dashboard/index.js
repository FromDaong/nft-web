import React, { useState, useEffect } from "react";
import Spinner from "react-bootstrap/Spinner";
import Table from "react-bootstrap/Table";
import { Button } from "react-bootstrap";
import { useWallet } from "use-wallet";
import useSWR from "swr";
import Link from "next/link";
import Layout from "../../components/Layout";
import Hero from "../../components/Hero";

const AdminDashboardWrapper = () => {
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
              <Button colorScheme="pink">
                <b>{"Login to Panel"}</b>
              </Button>
            </Link>
          }
        />
      );
    return <AdminDashboard />;
  }
};

const AdminDashboard = () => {
  const { data } = useSWR(`/api/admin/get-pending`);

  return (
    <Layout>
      <div className="container my-nft-container">
        <Hero
          title={"Admin Dashboard"}
          subtitle={`Approve and reject creator application requests here. Click an application for more info`}
          additionalContent={
            <>
              <Link href="/admin-dashboard/create-totm-nfts">
                <a>
                  <Button colorScheme="pink" mr={2}>
                    <b>{"Create TOTM NFTs"}</b>
                  </Button>
                </a>
              </Link>
              <Link href="/admin-dashboard/create-melon-nfts">
                <Button variant="success w-sm-100 mr-2">
                  <b>{"Create $Melon NFTs"}</b>
                </Button>
              </Link>
              <Link href="/api/admin/logout">
                <Button colorScheme="pink">
                  <b>{"Logout"}</b>
                </Button>
              </Link>
            </>
          }
        />
        {/* <div className="white-tp-bg mt-4 p-3">
          <p className="w-100 mb-0" style={{ wordBreak: "break-word" }}>
            <b>Connected wallet address:</b>
            <div>{`${account}`}</div>
          </p>
        </div> */}

        <div className="mt-2 white-tp-container">
          <h4 className="mb-3">Pending ⌛</h4>
          <Table striped bordered hover className="bg-white">
            <thead>
              <tr>
                <th></th>
                <th className="text-center">Username</th>
                <th className="text-center">Address</th>
              </tr>
            </thead>
            <tbody>
              {data &&
                data.pendingModels.map((m) => (
                  <Link href={`/admin-dashboard/${m.username}`}>
                    <tr>
                      <td className="d-flex align-center justify-content-center">
                        <img src={m.profile_pic} style={{ maxHeight: 75 }} />
                      </td>
                      <td className="text-center">{m.username}</td>
                      <td className="text-center">{m.address}</td>
                    </tr>
                  </Link>
                ))}
            </tbody>
          </Table>
        </div>

        <div className="mt-4 white-tp-container">
          <h4 className="mb-3">Approved ✅</h4>
          <Table striped bordered hover className="bg-white">
            <thead>
              <tr>
                <th></th>
                <th className="text-center">Username</th>
                <th className="text-center">Address</th>
              </tr>
            </thead>
            <tbody>
              {data &&
                data.acceptedModels.map((m) => (
                  <Link href={`/admin-dashboard/${m.username}`}>
                    <tr>
                      <td className="d-flex align-center justify-content-center">
                        <img src={m.profile_pic} style={{ maxHeight: 75 }} />
                      </td>
                      <td className="text-center">{m.username}</td>
                      <td className="text-center">{m.address}</td>
                    </tr>
                  </Link>
                ))}
            </tbody>
          </Table>
        </div>
        <div className="mt-4 white-tp-container">
          <h4 className="mb-3">Rejected ❌</h4>
          <Table striped bordered hover className="bg-white">
            <thead>
              <tr>
                <th></th>
                <th className="text-center">Username</th>
                <th className="text-center">Address</th>
              </tr>
            </thead>
            <tbody>
              {data &&
                data.rejectedModels.map((m) => (
                  <Link href={`/admin-dashboard/${m.username}`}>
                    <tr>
                      <td className="d-flex align-center justify-content-center">
                        <img src={m.profile_pic} style={{ maxHeight: 75 }} />
                      </td>
                      <td className="text-center">{m.username}</td>
                      <td className="text-center">{m.address}</td>
                    </tr>
                  </Link>
                ))}
            </tbody>
          </Table>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboardWrapper;
