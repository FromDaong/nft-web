import React from "react";
import { Button } from "react-bootstrap";
import Link from "next/link";

const V2Banner = ({ oldTokenBalance }) => {
  return (
    <>
      <div
        className="alert-bar py-1 d-flex justify-content-center align-items-center"
        style={{
          color: "white",
          textAlign: "center",
          fontWeight: "bolder",
          background: "#DA5184",
          height: 60,
        }}
      >
        {"Our March edition Treat of the Month + Magazine is out now!"}
        <Link href="/magazine">
          <Button variant="light py-2 ml-2">
            <b>{"View Magazine"}</b>
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
