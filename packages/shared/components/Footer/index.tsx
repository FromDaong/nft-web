import { styled } from "@styles/theme";
import { ReactNode } from "react";
import { BoldLink } from "../Typography/Text";

const Ul = styled("ul", {
  display: "flex",
  flexDirection: "column",
  gap: "8px",
});

const ListLinkItem = ({
  href,
  children,
  ...rest
}: {
  href: string;
  children: ReactNode;
  target?: string;
  rel?: string;
}) => (
  <li>
    <a {...rest} href={href}>
      {children}
    </a>
  </li>
);

export default function Footer() {
  return (
    <footer className="w-full px-4 pt-16 border-t border-gray-200 md:px-8 lg:px-0">
      <div className="grid max-w-6xl grid-cols-1 gap-8 mx-auto md:grid-cols-4">
        <div className="col-span-1">
          <img
            src={"/assets/hero-logo.png"}
            alt=""
            className="logo w-100"
            style={{ maxWidth: 150 }}
          />
        </div>
        <div className="col-span-1">
          <h5 className="mb-2 text-xl font-medium text-gray-900 md:mb-4">
            $TREAT
          </h5>
          <Ul className="gap-2 list-unstyled text-small">
            <ListLinkItem
              target="_blank"
              rel="noreferrer"
              href="https://docs.google.com/gview?url=https://github.com/TreatDAO/litepaper/raw/main/TreatPaperFinal.pdf&embedded=true"
            >
              <BoldLink className="">Litepaper</BoldLink>
            </ListLinkItem>
            <ListLinkItem
              target="_blank"
              rel="noreferrer"
              href="https://pancakeswap.finance/swap?inputCurrency=0x01bd7acb6ff3b6dd5aefa05cf085f2104f3fc53f"
            >
              <BoldLink>Swap Tokens</BoldLink>
            </ListLinkItem>
            <ListLinkItem href={"/sweetshop"}>
              <BoldLink>Purchase NFTs</BoldLink>
            </ListLinkItem>
            <ListLinkItem
              href="https://www.coingecko.com/en/coins/treatdao-v2"
              target="_blank"
              rel="noreferrer"
            >
              <BoldLink>CoinGecko</BoldLink>
            </ListLinkItem>
            <ListLinkItem
              target="_blank"
              rel="noreferrer"
              href="https://coinmarketcap.com/en/currencies/treat-dao-new/"
            >
              <BoldLink>CoinMarketCap</BoldLink>
            </ListLinkItem>
          </Ul>
        </div>
        <div className="col-span-1">
          <h5 className="mb-2 text-xl font-medium text-gray-900 md:mb-4">
            Social Media
          </h5>
          <Ul className="list-unstyled text-small">
            <ListLinkItem
              href="https://t.me/TreatDAO"
              target="_blank"
              rel="noreferrer"
            >
              <BoldLink>Telegram</BoldLink>
            </ListLinkItem>
            <ListLinkItem
              href="https://twitter.com/treatdao"
              target="_blank"
              rel="noreferrer"
            >
              <BoldLink>Twitter</BoldLink>
            </ListLinkItem>
            <ListLinkItem
              href="https://www.instagram.com/treat_dao/"
              target="_blank"
              rel="noreferrer"
            >
              <BoldLink>Instagram</BoldLink>
            </ListLinkItem>
            <ListLinkItem
              href="https://www.tiktok.com/@treatdao"
              target="_blank"
              rel="noreferrer"
            >
              <BoldLink>TikTok</BoldLink>
            </ListLinkItem>
            <ListLinkItem
              href="https://treatdao.medium.com/"
              target="_blank"
              rel="noreferrer"
            >
              <BoldLink>Medium</BoldLink>
            </ListLinkItem>
          </Ul>
        </div>
        <div className="col-span-1">
          <h5 className="mb-2 text-xl font-medium text-gray-900 md:mb-4">
            Resources
          </h5>
          <Ul className="list-unstyled text-small">
            <ListLinkItem
              href="https://help.treatdao.com/"
              target="_blank"
              rel="noreferrer"
            >
              <BoldLink>Help Center</BoldLink>
            </ListLinkItem>
            <ListLinkItem
              href="https://www.bonfire.com/store/treatdao-merch/"
              target="_blank"
              rel="noreferrer"
            >
              <BoldLink>Merch Store</BoldLink>
            </ListLinkItem>
            <ListLinkItem href="/about">
              <BoldLink>About</BoldLink>
            </ListLinkItem>
            <ListLinkItem href="/privacy">
              <BoldLink>Privacy Policy</BoldLink>
            </ListLinkItem>
            <ListLinkItem href="/tos">
              <BoldLink>Terms of Service</BoldLink>
            </ListLinkItem>
          </Ul>
        </div>
      </div>
    </footer>
  );
}
