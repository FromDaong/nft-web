import { Button } from "@chakra-ui/react";
import Gallery from "../components/Gallery";
import Hero from "../components/Hero";

const Totm = () => {
  return (
    <div>
      <center>
        <Hero
          title={"Buy Crypto"}
          titleClass="primary"
          subtitle="You can buy Crypto easily through Moonpay's widget below. Use crypto throughout the Treat site."
        />
        <div>
          <iframe src="https://www.moonpay.com/buy" />
        </div>
      </center>
    </div>
  );
};

export default Totm;
