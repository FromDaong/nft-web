import React from "react";
import { motion } from "framer-motion";

let easing = [0.175, 0.85, 0.42, 0.96];

const variants = {
  hidden: { opacity: 0, x: -200, y: 0 },
  enter: { opacity: 1, x: 0, y: 0 },
  exit: { opacity: 0, x: 0, y: -100, transition: { when: "afterChildren" } },
};

const Layout = ({ children }) => (
  <div>
    <motion.main
      initial="hidden"
      animate="enter"
      exit="exit"
      variants={variants}
    >
      {children}
    </motion.main>
  </div>
);

export default Layout;
