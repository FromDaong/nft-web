import React, { useState, useEffect } from "react";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import Nav from "react-bootstrap/Nav";
import { useWallet } from "use-wallet";
import WalletModal from "../WalletModal";
import Link from "next/link";

const HeaderNav = () => {
  const { status, account, error, connect } = useWallet();
  const [modalShow, setModalShow] = useState(false);

  console.log({ status, error, account });

  useEffect(() => {
    connect("injected");
  }, []);

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
            <div>{account}</div>
          )}
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
};

export default HeaderNav;
