import React from "react";
import Hero from "../components/Hero";
import Farm from "../components/Farm";
import Loading from "../components/Loading";
import useTokenBalance from "../hooks/useTokenBalance";
import { motion } from "framer-motion";
import { useWallet } from "use-wallet";
import { getMasterMelonFarmerContract } from "../treat/utils";
import useTreat from "../hooks/useTreat";
import { contractAddresses } from "../treat/lib/constants.js";

const Farms = () => {
  const { networkId } = useWallet();
  const treatBal = useTokenBalance(contractAddresses.treat2[networkId]);
  const treat = useTreat();
  const masterMelonFarmerContract = getMasterMelonFarmerContract(treat);
  console.log({ treatBal });

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
        <Hero
          title={"Farming Dashboard"}
          subtitle={"Farm $Treat for $Melons to get exclusive NFTs"}
        />
        <div className="farming-container">
          <Farm
            title={"$Treat"}
            pid={0}
            contract={masterMelonFarmerContract}
            treatBal={treatBal}
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
