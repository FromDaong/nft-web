import React from "react";
import ModelList from "../components/ModelList";

const Home = () => {
  return (
    <>
      <br />
      <ModelList totwOnly={false} showNfts={false} />
    </>
  );
};

export default Home;
