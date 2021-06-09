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
import {ArrowRight, Instagram, Twitter} from "react-bootstrap-icons";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import 'font-awesome/css/font-awesome.min.css';


// Font Awesome Imports
import {library} from "@fortawesome/fontawesome-svg-core";
import {fab} from "@fortawesome/free-brands-svg-icons";
import {fas} from "@fortawesome/free-solid-svg-icons";


// Library Creation
library.add(fab, fas);
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
      <div className="m-2 row justify-content-center treat-border">
        <div className="col-md-12 text-center image-caption">
          <Image className="model-image" src={"/assets/wide.jpeg"}/>
          <div className="text-left caption">
            @sophox
          </div>
        </div>
        <div className="col-md-6">
          <p>
            Available in <span className="n-days">X days</span>
            <br></br>
            Available in <span className="n-days">Y days</span>
          </p>
        </div>
        <div className="col-md-6 text-right">
          <a><FontAwesomeIcon className="fa" icon={['fab', 'twitter']}/></a>
          <a><FontAwesomeIcon className="fa" icon={['fab', 'instagram']}/></a>
        </div>
      </div>

      <div className="m-2 row justify-content-center treat-border">
        <div className="col-sm-6 col-md-4 col-lg-3">
          <Image className="model-photo-sale" src={"/assets/belle.jpeg"}/>
        </div>
        <div className="col-sm-6 col-md-5 col-lg-6">
          <div className="row text-left">
            <div className="col-md-12">
              <div className="nft-header">
                Some Small Caption above title
              </div>
              <div className="nft-title">
                Some Generic Picture Title
              </div>
            </div>
            <div className="col-md-12 d-inline-flex nft-pricing-spacing">
              <div className="nft-pricing">
                <div className="nft-unit">
                  Unit Price
                </div>
                <div className="n-days">
                  0.05 BNB
                </div>
              </div>
              <div className="nft-pricing">
                <div className="nft-unit">
                  Time Left
                </div>
                <div className="n-days">
                  N Days
                </div>
              </div>
            </div>
            <div className="col-md-12 nft-creator d-inline-flex">
              <Image  src={"/assets/turtle.png"}/>
              <div>
                <div className="nft-creator-subtext">
                  Creator
                </div>
                <div className="nft-creator-text">
                  Soph
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-sm-12 col-md-3 col-lg-3 text-right align-self-end">
          <Button className="nft-click">View Nft</Button>
        </div>
      </div>

    </div>


  );
};

ViewModelWrapper.getInitialProps = async ({query: {username}}) => {
  return {username};
};

export default ViewModelWrapper;
