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
        {"Our April edition Treat of the Month + Magazine is out now!"}
        <Link href="/magazine">
          <Button className="ml-2" bgColor="white" color="gray.900">
            View Magazine
          </Button>
        </Link>
        {/* <a
          href="https://docs.google.com/gview?url=https://github.com/TreatDAO/litepaper/raw/main/TreatPaperFinal.pdf&embedded=true"
          target="_blank"
        >
          <Button variant="outline ml-3">
            <b className="text-white" style={{ textDecoration: "underline" }}>
              {"More Info"}
            </b>
          </Button>
        </a> */}
      </div>
    </>
  );
};

export default V2Banner;
