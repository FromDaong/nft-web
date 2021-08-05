import React from "react";
import Hero from "../components/Hero";
import ModelList from "../components/ModelList";
import { motion } from "framer-motion";

const Home = () => {
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
          title={"Our Creators"}
          subtitle={
            "Explore the creators creating content on the TreatDAO platform"
          }
        />
        <ModelList totwOnly={false} showNfts={false} />
      </motion.main>
    </>
  );
};

export default Home;
