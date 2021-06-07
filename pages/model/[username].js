import React, {useState, useEffect} from "react";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";
import useSWR from "swr";
import useWallet from "use-wallet";
import NFTListItem from "../../components/NFTListItem";
import {useRouter} from "next/router";
import {modelSetBundles} from "../../treat/lib/constants";
import useGetTreatSetCost from "../../hooks/useGetTreatSetCost";
import useRedeemSet from "../../hooks/useRedeemSet";
import {getDisplayBalance} from "../../utils/formatBalance";
import {Col, Container, Image, Row} from "react-bootstrap";
// import pic from "assets/wide.jpeg"

const ViewModelWrapper = ({username}) => {
  const {data: res} = useSWR(`/api/model/${username}`);
  const [modelData, setModelData] = useState();
  const [modelNFTs, setModelNFTs] = useState();
  const {status} = useWallet();
  const router = useRouter();

  useEffect(() => {
    (async () => {
      console.log({res});
      if (res) {
        setModelData(res);

        if (!res.nfts || res.nfts.length === 0) return setModelNFTs([]);

        const mNfts = await Promise.all(
          res.nfts.map(async (nft) => {
            const x = await fetch(`/api/nft/${nft.id}`);
            const j = await x.json();
            return j;
          })
        );

        setModelNFTs(mNfts);
      }
    })();
  }, [res]);

  const setId = modelSetBundles[username];
  const nftSetPrice = useGetTreatSetCost(setId);
  console.log({nftSetPrice: nftSetPrice?.toString()})
  const {onRedeemSet} = setId
    ? useRedeemSet(setId, nftSetPrice)
    : {onRedeemSet: null};

  if (!modelData || !modelData.username || status !== "connected") {
    return (
      <div
        style={{
          position: "fixed",
          width: "100%",
          height: "100%",
          display: "flex",
          top: 0,
          left: 0,
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h5
          style={{
            fontWeight: "bolder",
            background: "white",
            borderRadius: 5,
            padding: 10,
          }}
        >
          Please make sure your Binance Smart Chain wallet is connected.
        </h5>
        <Spinner
          animation="border"
          role="status"
          size="xl"
          style={{marginTop: 5}}
        >
          <span className="sr-only">Loading...</span>
        </Spinner>
      </div>
    );
  } else {
    return (
      <ViewModel
        modelData={modelData}
        modelNFTs={modelNFTs}
        nftSetPrice={nftSetPrice}
        onRedeemSet={onRedeemSet}
      />
    );
  }
};

const ViewModel = ({modelData, modelNFTs, nftSetPrice, onRedeemSet}) => {
  console.log({modelNFTs});
  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-12 center text-center">
          <Image src={"/assets/wide.jpeg"}/>
          <div className="text-left">
            Some Text
          </div>
        </div>
        <div className="col-md-12">
          <Image src={"/assets/wide.jpeg"}/>
          <div>
            Some Text
          </div>
        </div>
      </div>
    </div>

  );
};

ViewModelWrapper.getInitialProps = async ({query: {username}}) => {
  return {username};
};

export default ViewModelWrapper;
