import React, { useState, useEffect } from "react";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import Nav from "react-bootstrap/Nav";
import { useWallet } from "use-wallet";
import WalletModal from "../WalletModal";
import Link from "next/link";

const HeaderNav = () => {
  const { status, account, error, connect, reset } = useWallet();
  const [modalShow, setModalShow] = useState(false);

  console.log({ status, error, account });

  useEffect(() => {
    if (status === "connected" && !account) connect("injected");

    const connectedBefore = localStorage.getItem("connectedBefore");
    if (connectedBefore && status === "disconnected") connect("injected");
  }, [status]);

  useEffect(() => {
    if (status === "connected") {
      setModalShow(false);
    }
  }, [status]);

  return (
    <Navbar expand="lg" className="mb-4" sticky="top" className="main-nav">
      <WalletModal show={modalShow} handleClose={() => setModalShow(false)} />
      <div className="container">
        <Link href="/">
          <Navbar.Brand>
            <img src={"/assets/banner-logo.png"} alt="" className="logo" />
          </Navbar.Brand>
        </Link>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse className="justify-content-end">
          <Link href="/">
            <Nav.Link>MARKETPLACE</Nav.Link>
          </Link>
          <Link href="/about">
            <Nav.Link>ABOUT</Nav.Link>
          </Link>
          {!account ? (
            <Button
              variant="primary px-4 ml-md-4"
              onClick={() => setModalShow(true)}
            >
              <b>CONNECT WALLET</b>
            </Button>
          ) : (
            <div className="ml-md-4">
              {account.substring(0, 10)}...
              <Button
                variant="secondary px-4 ml-md-4"
                onClick={() => {
                  localStorage.removeItem("connectedBefore");
                  reset();
                }}
              >
                <b>DISCONNECT</b>
              </Button>
            </div>
          )}
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
};

export default HeaderNav;