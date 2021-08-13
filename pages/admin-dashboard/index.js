import React, { useState, useEffect } from "react";
import Spinner from "react-bootstrap/Spinner";
import Table from "react-bootstrap/Table";
import useWallet from "use-wallet";
import useSWR from "swr";
import Layout from "../../components/Layout";
import Hero from "../../components/Hero";

const AdminDashboardWrapper = () => {
  const { account, status } = useWallet();

  const { data: res } = useSWR(`/api/nft`);
  const [nftArray, setNftData] = useState();

  useEffect(() => {
    (async () => {
      if (res) {
        setNftData(res);
      }
    })();
  }, [res]);

  if (status !== "connected" || !nftArray) {
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
    return (
      <Layout>
        <div className="container  my-nft-container">
          <Hero
            title={"Admin Dashboard"}
            subtitle={`Approve and reject creator application requests here`}
          />
          {/* <div className="white-tp-bg mt-4 p-3">
          <p className="w-100 mb-0" style={{ wordBreak: "break-word" }}>
            <b>Connected wallet address:</b>
            <div>{`${account}`}</div>
          </p>
        </div> */}
          <div className="mt-2 bg-white">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th></th>
                  <th>Username</th>
                  <th>Address</th>
                </tr>
              </thead>
              <tbody>
                {}
                <tr>
                  <td>
                    <img src="" />
                  </td>
                  <td>Mark</td>
                  <td>Otto</td>
                </tr>
              </tbody>
            </Table>
          </div>
        </div>
      </Layout>
    );
  }
};

export default AdminDashboardWrapper;
