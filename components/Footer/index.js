import React, { useState, useEffect } from "react";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Button from "react-bootstrap/Button";
import Nav from "react-bootstrap/Nav";
import { useWallet } from "use-wallet";
import WalletModal from "../WalletModal";
import BalanceModal from "../BalanceModal";
import Link from "next/link";

const Footer = () => {
  const { status, account, error, reset } = useWallet();
  const [walletModalShow, setWalletModalShow] = useState(false);
  const [balanceModalShow, setBalanceModalShow] = useState(false);

  useEffect(() => {
    if (status === "connected") {
      setWalletModalShow(false);
    }
  }, [status]);

  return (
    <footer class="py-5 border-top footer">
      <div className="container">
        <div class="row">
          <div class="col-md-3">
            <img
              src={"/assets/hero-logo.png"}
              alt=""
              className="logo w-100"
              style={{ maxWidth: 150 }}
            />
          </div>
          <div class="col-md-3 mt-5 mt-md-0">
            <h5>$TREAT</h5>
            <ul class="list-unstyled text-small">
              <li>
                <a
                  class=""
                  href="https://pancakeswap.finance/info/token/0x01bd7acb6fF3B6Dd5aefA05CF085F2104f3fC53F"
                  target="_blank"
                >
                  Swap Tokens
                </a>
              </li>
              <li>
                <a class="/" href="#">
                  Purchase NFTs
                </a>
              </li>
              <li>
                <a
                  href="https://www.coingecko.com/en/coins/treatdao-v2"
                  target="_blank"
                >
                  CoinGecko
                </a>
              </li>
              <li>
                <a
                  href="https://coinmarketcap.com/currencies/treat-dao/"
                  target="_blank"
                >
                  CoinMarketCap
                </a>
              </li>
            </ul>
          </div>
          <div class="col-md-3 mt-3 mt-md-0">
            <h5>Social Media</h5>
            <ul class="list-unstyled text-small">
              <li>
                <a href="https://t.me/TreatDAO" target="_blank">
                  Telegram
                </a>
              </li>
              <li>
                <a href="https://twitter.com/treatdao" target="_blank">
                  Twitter
                </a>
              </li>
              <li>
                <a href="https://www.instagram.com/treat_dao/" target="_blank">
                  Instagram
                </a>
              </li>
              <li>
                <a href="https://www.tiktok.com/@treatdao" target="_blank">
                  TikTok
                </a>
              </li>
              <li>
                <a href="https://treatdao.medium.com/" target="_blank">
                  Medium
                </a>
              </li>
            </ul>
          </div>
          <div class="col-md-3 mt-3 mt-md-0">
            <h5>Resources</h5>
            <ul class="list-unstyled text-small">
              <li>
                <a href="/about">About</a>
              </li>
              <li>
                <a href="/privacy">Privacy Policy</a>
              </li>
              <li>
                <a href="/tos">Terms of Service</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
