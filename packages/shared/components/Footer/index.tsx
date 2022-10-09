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
          <ul className="list-unstyled text-small">
            <li>
              <a
                className=""
                href="https://docs.google.com/gview?url=https://github.com/TreatDAO/litepaper/raw/main/TreatPaperFinal.pdf&embedded=true"
                target="_blank"
                rel="noreferrer"
              >
                Litepaper
              </a>
            </li>
            <li>
              <a
                className=""
                href="https://pancakeswap.finance/swap?inputCurrency=0x01bd7acb6ff3b6dd5aefa05cf085f2104f3fc53f"
                target="_blank"
                rel="noreferrer"
              >
                Swap Tokens
              </a>
            </li>
            <li>
              <a className="/" href="#">
                Purchase NFTs
              </a>
            </li>
            <li>
              <a
                href="https://www.coingecko.com/en/coins/treatdao-v2"
                target="_blank"
                rel="noreferrer"
              >
                CoinGecko
              </a>
            </li>
            <li>
              <a
                href="https://coinmarketcap.com/en/currencies/treat-dao-new/"
                target="_blank"
                rel="noreferrer"
              >
                CoinMarketCap
              </a>
            </li>
          </ul>
        </div>
        <div className="col-span-1">
          <h5 className="mb-2 text-xl font-medium text-gray-900 md:mb-4">
            Social Media
          </h5>
          <ul className="list-unstyled text-small">
            <li>
              <a href="https://t.me/TreatDAO" target="_blank" rel="noreferrer">
                Telegram
              </a>
            </li>
            <li>
              <a
                href="https://twitter.com/treatdao"
                target="_blank"
                rel="noreferrer"
              >
                Twitter
              </a>
            </li>
            <li>
              <a
                href="https://www.instagram.com/treat_dao/"
                target="_blank"
                rel="noreferrer"
              >
                Instagram
              </a>
            </li>
            <li>
              <a
                href="https://www.tiktok.com/@treatdao"
                target="_blank"
                rel="noreferrer"
              >
                TikTok
              </a>
            </li>
            <li>
              <a
                href="https://treatdao.medium.com/"
                target="_blank"
                rel="noreferrer"
              >
                Medium
              </a>
            </li>
          </ul>
        </div>
        <div className="col-span-1">
          <h5 className="mb-2 text-xl font-medium text-gray-900 md:mb-4">
            Resources
          </h5>
          <ul className="list-unstyled text-small">
            <li>
              <a
                href="https://help.treatdao.com/"
                target="_blank"
                rel="noreferrer"
              >
                Help Center
              </a>
            </li>
            <li>
              <a
                href="https://www.bonfire.com/store/treatdao-merch/"
                target="_blank"
                rel="noreferrer"
              >
                Merch Store
              </a>
            </li>
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
    </footer>
  );
}
