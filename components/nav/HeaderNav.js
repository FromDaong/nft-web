import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import Nav from "react-bootstrap/Nav";
import { useWallet } from "use-wallet";
import Link from "next/link";

const HeaderNav = () => {
  const wallet = useWallet();

  return (
    <Navbar expand="lg" className="mb-4" sticky="top" className="main-nav">
      <div className="container">
        <Navbar.Brand as={Link} href="/">
          <img src={"/assets/banner-logo.png"} alt="" className="logo" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse className="justify-content-end">
          <Nav.Link as={Link} href="/">
            MARKETPLACE
          </Nav.Link>
          <Nav.Link as={Link} href="/about">
            ABOUT
          </Nav.Link>
          <Button
            variant="primary px-4 ml-md-4"
            onClick={() => wallet.connect()}
          >
            <b>CONNECT WALLET</b>
          </Button>
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
};

export default HeaderNav;
