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
        <div>
          <iframe
            width="100%"
            height="800px"
            src="https://flooz.trade/wallet/0x01bd7acb6ff3b6dd5aefa05cf085f2104f3fc53f?refId=ikUONy"
          />
        </div>
      </center>
    </div>
  );
};

export default Totm;
