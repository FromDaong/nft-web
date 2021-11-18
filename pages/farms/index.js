import React from "react";
import Hero from "../../components/Hero";
import Farm from "../../components/Farm";
import Loading from "../../components/Loading";
import useTokenBalance from "../../hooks/useTokenBalance";
import { motion } from "framer-motion";
import { useWallet } from "use-wallet";
import { getMasterMelonFarmerContract, getPendingMelons } from "../../treat/utils";
import useTreat from "../../hooks/useTreat";
import { contractAddresses } from "../../treat/lib/constants.js";
import { Button } from "react-bootstrap";

import Link from "next/link";

const Farms = () => {
  const { chainId } = useWallet();
  const treatBal = useTokenBalance(contractAddresses.treat2[chainId]);
  const treatLpBal = useTokenBalance(contractAddresses.treatPancakeLP[chainId]);
  const melonBal = useTokenBalance(contractAddresses.melon[chainId]);
  const treat = useTreat();
  const masterMelonFarmerContract = getMasterMelonFarmerContract(treat);

  return (
    <>
      <motion.main
        variants={{
          hidden: { opacity: 0, x: -200, y: 0 },
          enter: { opacity: 1, x: 0, y: 0 },
          exit: { opacity: 0, x: 0, y: -100 },
        }}
        initial="hidden" // Set the initial state to variants.hidden
        animate="enter" // Animated state to variants.enter
        exit="exit" // Exit state (used later) to variants.exit
        transition={{ type: "linear" }} // Set the transition to linear
        className=""
      >
        <center>
          <Hero
            title={"Farming Dashboard"}
            subtitle={
              "Stake $Treat to earn $Melon. Exchange $Melon at the Farmers' Market to get exclusive NFTs."
            }
          />
        </center>
        <div className="farming-container">
          <div className="melon-balance pink-bg">
            <div>
              <b>🍈 $Melon Balance:</b> {melonBal}
            </div>
            <Link href="/farms/farmers-market">
              <Button variant="success">
                <b>Go to Farmers' 🍈 Market</b>
              </Button>
            </Link>
          </div>
          <Farm
            title={"$Treat"}
            pid={0}
            contract={masterMelonFarmerContract}
            treatBal={treatBal}
          />
          <br />
          <br />
          <br />
          <Farm
            title={"$Treat/BNB"}
            pid={1}
            contract={masterMelonFarmerContract}
            treatBal={treatLpBal}
          />
        </div>
      </motion.main>
    </>
  );
};

const FarmsWrapper = (props) => {
  const { account, status } = useWallet();

  if (status !== "connected") {
    return <Loading />;
  } else {
    return <Farms {...props} />;
  }
};

export default FarmsWrapper;
