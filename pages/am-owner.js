import React, { useState, useEffect } from "react";
import Loading from "../components/Loading";
import useSWR from "swr";
import EthCrypto from "eth-crypto";
import useTreat from "../hooks/useTreat";
import useWallet from "use-wallet";

const ViewNFTWrapper = ({ id }) => {
  const [done, setDone] = useState(false);
  const { status, account } = useWallet();
  const treat = useTreat();

  useEffect(() => {
    (async () => {
      if (account && treat && !done) {
        const signature = await treat.signMessage(account);
        setDone(true);

        const res = await fetch(`/api/nft/view-nft`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ nft_id: 2, signature }),
        });
        const resJSON = await res.json();

        if (resJSON.success) {
          if (typeof window !== "undefined") window.reload();
        }
      }
    })();
  }, [account, treat]);

  if (status !== "connected") {
    return <Loading />;
  } else {
    return <ViewNFT account={account} />;
  }
};

const ViewNFT = ({ account }) => {
  return <div className="container">asd</div>;
};

// ViewNFTWrapper.getInitialProps = async ({ query: { id } }) => {
//   return { id };
// };

export default ViewNFTWrapper;
