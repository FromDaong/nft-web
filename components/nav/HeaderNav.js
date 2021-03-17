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
      <Link href="/">
        <Navbar.Brand>
          <img src={"/assets/banner-logo.png"} alt="" className="logo" />
        </Navbar.Brand>
        </Link>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse className="justify-content-end">
        <Link href="/">
          <Nav.Link>
            MARKETPLACE
          </Nav.Link>
          </Link>
          <Link href="/about">
          <Nav.Link>
            ABOUT
          </Nav.Link>
          </Link>
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
