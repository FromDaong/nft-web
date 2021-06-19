import React, { useState, useEffect } from "react";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Button from "react-bootstrap/Button";
import Nav from "react-bootstrap/Nav";
import { useWallet } from "use-wallet";
import WalletModal from "../WalletModal";
import AgeModal from "../AgeModal";
import BalanceModal from "../BalanceModal";
import Link from "next/link";

const HeaderNav = () => {
  const { status, account, error, reset } = useWallet();
  const [walletModalShow, setWalletModalShow] = useState(false);
  const [balanceModalShow, setBalanceModalShow] = useState(false);
  const [ageModalShow, setAgeModalShow] = useState(false);

  console.log({ status, error, account });

  useEffect(() => {
    (async () => {
      const verified = await localStorage.getItem("ageVerified");
      console.log({ verified });
      if (!verified) setAgeModalShow(true);
    })();
  });

  useEffect(() => {
    if (status === "connected") {
      setWalletModalShow(false);
    }
  }, [status]);

  return (
    <Navbar expand="lg" className="mb-4" sticky="top" className="main-nav">
      <WalletModal
        show={walletModalShow}
        handleClose={() => setWalletModalShow(false)}
      />
      <BalanceModal
        show={balanceModalShow}
        handleClose={() => setBalanceModalShow(false)}
        account={account}
      />
      <AgeModal
        show={ageModalShow}
        handleClose={() => setAgeModalShow(false)}
        account={account}
      />
      <div className="container">
        <Navbar.Brand>
          <Link href="/" passHref>
            <a>
              <img src={"/assets/banner-logo.png"} alt="" className="logo" />
            </a>
          </Link>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse className="justify-content-end">
          <Nav.Link href="/creators" passHref>
            CREATORS
          </Nav.Link>
          <Nav.Link href="/apply" passHref>
            APPLY
          </Nav.Link>
          <Link href="/about" passHref>
            <Nav.Link>ABOUT</Nav.Link>
          </Link>
          <Nav.Link
            href="https://treatdao.medium.com/c6aaa613725d"
            target="_blank"
          >
            BLOG
          </Nav.Link>

          {account && (
            <Link href="/my-nfts" passHref>
              <Nav.Link>MY NFTs</Nav.Link>
            </Link>
          )}
          {!account ? (
            <Button
              variant="primary px-4 ml-md-4"
              onClick={() => setWalletModalShow(true)}
            >
              <b>CONNECT WALLET</b>
            </Button>
          ) : (
            <div className="ml-md-4">
              <NavDropdown
                title={`WALLET ${account.substring(0, 6)}...`}
                id="basic-nav-dropdown"
                variant="primary"
              >
                <Link href="/my-nfts" passHref>
                  <NavDropdown.Item>MY NFTs</NavDropdown.Item>
                </Link>
                <NavDropdown.Item
                  onClick={() => {
                    console.log(123);
                    setBalanceModalShow(true);
                  }}
                >
                  $TREAT BALANCE
                </NavDropdown.Item>
                <NavDropdown.Item
                  onClick={() => {
                    localStorage.removeItem("connectedBefore");
                    reset();
                  }}
                >
                  DISCONNECT
                </NavDropdown.Item>
              </NavDropdown>
            </div>
          )}
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
};

export default HeaderNav;
