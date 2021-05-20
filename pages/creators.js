import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import NFTListItem from "../components/NFTListItem";
import ModelListItem from "../components/ModelListItem";
import ModelList from "../components/ModelList";
import useSWR from "swr";
import * as Scroll from "react-scroll";

const Home = () => {
  return (
    <ModelList totwOnly={false} showNfts={false} />
  )
};

export default Home;
