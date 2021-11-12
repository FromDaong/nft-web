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

const HeaderNav = ({ modelData }) => {
  const { status, account, error, reset, chainId } = useWallet();
  const [walletModalShow, setWalletModalShow] = useState(false);
  const [balanceModalShow, setBalanceModalShow] = useState(false);
  const [ageModalShow, setAgeModalShow] = useState(false);

  console.log({ chainId });

  useEffect(() => {
    (async () => {
      const verified = await localStorage.getItem("ageVerified");
      if (!verified) setAgeModalShow(true);
    })();
  });

  useEffect(() => {
    if (status === "connected") {
      setWalletModalShow(false);
    }
  }, [status]);

  console.log({ modelData });

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
          <Link href="/creators" passhref>
            <Nav.Link href="/creators">Creators</Nav.Link>
          </Link>
          {account && !account.pending && !account.rejected && (
            <>
              <NavDropdown title="Marketplaces">
                <NavDropdown.Item href="#action/3.1" className="p-0">
                  <Link href="/marketplace/creator" passHref>
                    <Nav.Link>The Sweet Shop</Nav.Link>
                  </Link>
                </NavDropdown.Item>
                <NavDropdown.Item href="#action/3.1" className="p-0">
                  <Link href="/marketplace/resale" passHref>
                    <Nav.Link>Resale Marketplace</Nav.Link>
                  </Link>
                </NavDropdown.Item>
              </NavDropdown>
              <Link href="/my-nfts" passHref>
                <Nav.Link>My NFTs</Nav.Link>
              </Link>
              {modelData && !modelData.pending && !modelData.rejected ? (
                <Link href="/creator-dashboard" passHref>
                  <Nav.Link style={{ color: "#c34573" }}>
                    Creator Dashboard
                  </Nav.Link>
                </Link>
              ) : (
                <Link href="/become-creator" passHref>
                  <Nav.Link>Apply</Nav.Link>
                </Link>
              )}
            </>
          )}

          {!account && (
            <>
              <Link href="/about" passHref>
                <Nav.Link>About</Nav.Link>
              </Link>
              <Nav.Link
                href="https://treatdao.medium.com/c6aaa613725d"
                target="_blank"
              >
                Blog
              </Nav.Link>
            </>
          )}

          {!account ? (
            <Button
              variant="primary px-4 ml-md-4"
              onClick={() => setWalletModalShow(true)}
            >
              <b>Connect Wallet</b>
            </Button>
          ) : (
            <div className="ml-md-4">
              <NavDropdown
                title={
                  chainId === 56
                    ? `${account.substring(0, 6)}...${account.substr(-5)}`
                    : "Switch Chain to BSC"
                }
                disabled={chainId !== 56}
                id="basic-nav-dropdown"
              >
                <Link href="/my-nfts" passHref>
                  <NavDropdown.Item>My NFTs</NavDropdown.Item>
                </Link>
                <NavDropdown.Item
                  onClick={() => {
                    setBalanceModalShow(true);
                  }}
                >
                  $Treat Balance
                </NavDropdown.Item>
                {!modelData || modelData.pending || modelData.rejected ? (
                  <Link href="/become-creator" passHref>
                    <NavDropdown.Item>Become a Creator</NavDropdown.Item>
                  </Link>
                ) : (
                  <Link href="/creator-dashboard" passHref>
                    <NavDropdown.Item>Creator Dashboard</NavDropdown.Item>
                  </Link>
                )}
                <NavDropdown.Item
                  style={{ borderRadius: 8 }}
                  onClick={() => {
                    localStorage.removeItem("connectedBefore");
                    reset();
                  }}
                >
                  Disconnect
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
