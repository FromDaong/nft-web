import React from "react";
import { motion } from "framer-motion";

const Hero = ({ title, subtitle, additionalContent, titleClass }) => {
  return (
    <div
      animate={{ y: 0, opacity: 1 }}
      style={{ y: -100, opacity: 0 }}
      transition={{ delay: 0.25 }}
      className="pink-bg mb-5"
    >
      <div
        className={`heading-text p-0 mt-5 ${titleClass}`}
        style={{ fontSize: "3.5em", lineHeight: 1.2 }}
      >
        {title}
      </div>
      <p
        className="totw-secondary-text m-0 mt-2 pb-3"
        style={{ maxWidth: "none" }}
      >
        {subtitle}
      </p>
      {additionalContent}
    </div>
  );
};

export default Hero;
