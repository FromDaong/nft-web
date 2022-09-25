import Hero from "../components/Hero";

const Totm = () => {
  return (
    <div>
      <center>
        <Hero
          title={"Buy Crypto"}
          titleClass="primary"
          subtitle="You can buy BNB easily through floorz.trade's widget below. Use BNB throughout the Treat site or purchase $TREAT."
        />
        <div style={{ marginTop: -30 }}>
          <iframe
            width="100%"
            height="800px"
            src="https://flooz.trade/embedded/0x01bd7acb6fF3B6Dd5aefA05CF085F2104f3fC53F?backgroundColor=transparent&lightMode=true&refId=ikUONy"
          />
        </div>
      </center>
    </div>
  );
};

export default Totm;
