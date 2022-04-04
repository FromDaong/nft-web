import { useEffect, useState } from "react";

import AgeModal from "../AgeModal";
import BalanceModal from "../BalanceModal";
import { Button } from "@chakra-ui/react";
import Link from "next/link";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import Navbar from "react-bootstrap/Navbar";
import NavbarQuickSearch from "../Search/NavbarQuickSearch";
import WalletModal from "../WalletModal";
import { destroyCookie } from "nookies";
import { useMoralis } from "react-moralis";
import { useRouter } from "next/router";

const HeaderNav = ({ modelData }) => {
  const [walletModalShow, setWalletModalShow] = useState(false);
  const [balanceModalShow, setBalanceModalShow] = useState(false);
  const [ageModalShow, setAgeModalShow] = useState(false);
  const { isAuthenticated, chainId, user, enableWeb3, logout, account } =
    useMoralis();
  const router = useRouter();

  const signOut = () => {
    localStorage.removeItem("connectedBefore");
    logout();
    destroyCookie(null, "token");
    destroyCookie(null, "refreshToken");
    router.push("/");
  };

  useEffect(() => {
    enableWeb3();
  }, [enableWeb3]);

  useEffect(() => {
    if (isAuthenticated) {
      setWalletModalShow(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    (async () => {
      const verified = await localStorage.getItem("ageVerified");
      if (!verified) setAgeModalShow(true);
    })();
  }, []);

  return (
    <Navbar
      expand="lg"
      sticky="top"
      className="mb-4 main-nav"
      style={{ zIndex: 10 }}
    >
      <WalletModal
        show={walletModalShow}
        handleClose={() => setWalletModalShow(false)}
      />
      <BalanceModal
        show={balanceModalShow}
        handleClose={() => setBalanceModalShow(false)}
      />
      <AgeModal
        show={ageModalShow}
        handleClose={() => setAgeModalShow(false)}
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
          <div className="mr-md-4">
            <NavbarQuickSearch />
          </div>
          <Link href="/magazine" passHref>
            <Nav.Link>Magazine</Nav.Link>
          </Link>
          <NavDropdown title="Creators">
            <NavDropdown.Item href="#" className="p-0">
              <Link href="/creators" passHref>
                <Nav.Link>All Creators</Nav.Link>
              </Link>
            </NavDropdown.Item>
            <NavDropdown.Item href="#" className="p-0">
              <Link href="/subscriptions" passHref>
                <Nav.Link>Subscriptions</Nav.Link>
              </Link>
            </NavDropdown.Item>
          </NavDropdown>

          {isAuthenticated && user && !user.pending && !user.rejected && (
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

              <NavDropdown title="Farms">
                <NavDropdown.Item href="/farms" className="p-0">
                  <Link href="/farms" passHref>
                    <Nav.Link>Farming Dashboard</Nav.Link>
                  </Link>
                </NavDropdown.Item>
                <NavDropdown.Item href="#action/3.1" className="p-0">
                  <Link href="/farms/farmers-market" passHref>
                    <Nav.Link>Farmers&#39; Market</Nav.Link>
                  </Link>
                </NavDropdown.Item>
              </NavDropdown>
              <Link href="/dashboard" passHref>
                <Nav.Link style={{ color: "#c34573" }}>Dashboard</Nav.Link>
              </Link>
              {/* {modelData && !modelData.pending && !modelData.rejected ? null : (
                <Link href="/become-creator" passHref>
                  <Nav.Link>Apply</Nav.Link>
                </Link>
              )} */}
            </>
          )}

          {!user && (
            <>
              <Link href="/about" passHref>
                <Nav.Link>About</Nav.Link>
              </Link>
              <Nav.Link href="https://treatdao.medium.com/" target="_blank">
                Blog
              </Nav.Link>
            </>
          )}

          {!isAuthenticated ? (
            <Button
              className="bg-primary text-white"
              onClick={() => setWalletModalShow(true)}
            >
              <b>Sign in</b>
            </Button>
          ) : (
            <div className="ml-md-4">
              <NavDropdown
                title={
                  chainId === "0x38"
                    ? `${user.get("ethAddress").substring(0, 6)}...${user
                        .get("ethAddress")
                        .substr(-5)}`
                    : "Switch Chain to BSC"
                }
                disabled={chainId !== "0x38" && chainId !== "0x61"}
                id="basic-nav-dropdown"
              >
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
                  <Link href="/dashboard" passHref>
                    <NavDropdown.Item>Dashboard</NavDropdown.Item>
                  </Link>
                )}
                <NavDropdown.Item>
                  <Link href={`/p/${account}`}>
                    <a>My NFT Profile</a>
                  </Link>
                </NavDropdown.Item>
                <NavDropdown.Item style={{ borderRadius: 8 }} onClick={signOut}>
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
