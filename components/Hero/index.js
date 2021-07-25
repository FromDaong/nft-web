import React from "react";
import { motion } from "framer-motion";

const Hero = ({ title, subtitle }) => {
  return (
    <motion.div
      animate={{ y: 0, opacity: 1 }}
      style={{ y: -100, opacity: 0 }}
      transition={{ delay: 0.25 }}
      className="pink-bg mb-5"
    >
      <div className="heading-text p-0 mt-5" style={{ fontSize: "3em" }}>
        {title}
      </div>
      <p className="totw-secondary-text m-0">{subtitle}</p>
    </motion.div>
  );
};

export default Hero;
