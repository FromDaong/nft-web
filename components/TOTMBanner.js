import { Button } from "@chakra-ui/react";
import Link from "next/link";
import React from "react";

const V2Banner = () => {
  return (
    <>
      <div
        className="alert-bar py-2 flex flex-col lg:flex-row items-center justify-center"
        style={{
          color: "white",
          textAlign: "center",
          fontWeight: "bolder",
          background: "#DA5184",
        }}
      >
        {"Our June edition Treat of the Month + Magazine is out now!"}
        <Link href="/magazine">
          <Button className="ml-2" bgColor="white" color="gray.900">
            View Magazine
          </Button>
        </Link>
      </div>
    </>
  );
};

export default V2Banner;
