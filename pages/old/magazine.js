import { Button } from "@chakra-ui/react";
import Gallery from "../../components/Gallery";
import Hero from "../../components/Hero";

const Totm = () => {
  return (
    <div>
      <center>
        <Hero
          title={"Treat Magazine"}
          titleClass="primary"
          subtitle="A curated publication by Treat DAO featuring one creator each month"
          additionalContent={
            <div>
              <a
                href="https://opensea.io/collection/treatofthemonth"
                target="_blank"
                rel="noopener noreferrer"
              >
                <a>
                  <Button className="text-white bg-primary">
                    <b>{"Visit the Ethereum Collection"}</b>
                  </Button>
                </a>
              </a>
            </div>
          }
        />
        <div>
          <Gallery />
        </div>
      </center>
    </div>
  );
};

export default Totm;