import { Button } from "@chakra-ui/react";
import Layout from "../components/Layout";
// import HeroLogo from "/assets/hero-logo.png";

const About = () => {
  return (
    <Layout>
      <div className="about">
        <div className="hero">
          <div className="row d-flex align-items-center">
            <div className="col-lg-6 hero-text">
              <div className="heading-text">
                Maybe it’s time to treat yourself... 💋
              </div>
            </div>
            <div className="col-lg-1"></div>
            <div className="col-lg-5 hero-logo-container mt-5">
              <img src={"/assets/hero-logo.png"} alt="" />
            </div>
          </div>
        </div>
        <div className="white-tp-container">
          <div className="subtitle-text pt-1">Hey you 👋</div>
          <div className="secondary-text pb-3">
            Welcome to TreatDAO - a place where you can mint and sell your
            private, limited NFTs. Create SFW and NSFW content tailored to your
            community with our simplified tools. Get paid for your initial sales
            and enjoy recurring revenue with secondary market sales. Every time
            your content gets sold or exchanged between collectors on our
            platform; you earn a share of that sale!
          </div>

          <br />
          <div className="row">
            <div className="col-lg-4 p2 mt-3 mt-lg-0">
              <div className="info-card">
                <div className="img">
                  <img src={"/assets/clock.png"} alt="" className="logo" />
                </div>
                <div className="name">Instant Withdrawals</div>
                <div className="desc">
                  Unlike other platforms, we don’t hold your money: forget about
                  “pending funds” and withdrawal delays!
                </div>
              </div>
            </div>
            <div className="col-lg-4 p2 mt-3 mt-lg-0">
              <div className="info-card">
                <div className="img">
                  <img src={"/assets/pen.png"} alt="" className="logo" />
                </div>
                <div className="name"> Help Build Your Platform</div>
                <div className="desc">
                  Hold $TREAT and make decisions about the direction of the
                  platform: features, updates, rules, etc.
                </div>
              </div>
            </div>
            <div className="col-lg-4 p2 mt-3 mt-lg-0">
              <div className="info-card">
                <div className="img">
                  <img src={"/assets/money.png"} alt="" className="logo" />
                </div>
                <div className="name">Uncapped Earning Potential</div>
                <div className="desc">
                  No maximum limit on how much you can earn or charge. Take
                  control of your content and audience.
                </div>
              </div>
            </div>
          </div>
          <br />
          <div className="row the-dao mt-5">
            <div className="col-md-4">
              <img src={"/assets/render.png"} alt="" className="logo" />
            </div>
            <div className="col-md-8">
              <div className="subtitle-text">The DAO</div>
              <div className="secondary-text">
                Now you know about the treats, but what about The DAO? DAO
                stands for Decentralized Autonomous Organization - we don’t have
                board members or a central office. What we do have is a
                community of like-minded people who are working together to make
                TreatDAO possible. The only requirement to be a part of the
                community is to hold $TREAT tokens. Once you hold our token you
                get to have a voice when it comes to making major decisions,
                introducing new features, or choosing new partnerships.
              </div>
            </div>
          </div>
        </div>
        <div className="white-tp-container mt-4 mb-5">
          <div className="row pb-3">
            <div className="col-md-8 mt-2">
              <div className="secondary-text">
                <div className="subtitle-text">$TREAT Token</div>
                <p>
                  TreatDAO is the first platform that allows creators and
                  consumers to have a voice when it comes to the platform
                  development, terms of service, and all other decisions. This
                  has been made possible thanks to the introduction of $TREAT
                  token which can be used to make governing decisions. The more
                  tokens you own, the more voting power you get.
                </p>
                <p>
                  $TREAT was fairly distributed to the initial community members
                  to avoid exploits and level out the playing field.
                </p>
                <p>
                  To purchase $TREAT tokens, you can use one of the following
                  DEXes and exchanges:
                </p>
                <a
                  href="https://pancakeswap.finance/swap?inputCurrency=0x01bd7acb6ff3b6dd5aefa05cf085f2104f3fc53f"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Button className="bg-primary text-white font-bold mt-4">
                    <b>SWAP WITH 1INCH</b>
                  </Button>
                </a>
              </div>
            </div>
            <div className="col-md-4 mt-5 mt-lg-0">
              <img src={"/assets/pie.png"} alt="" className="logo w-100 px-5" />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;
