import BigNumber from 'bignumber.js'
import React, { useState, useEffect } from "react";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";
import { generateFromString } from "generate-avatar";
import { Blurhash } from "react-blurhash";
import { EyeSlash } from "react-bootstrap-icons";
import { modelSetBundles } from "../../treat/lib/constants";
import useGetTreatSetCost from "../../hooks/useGetTreatSetCost";
import useRedeemSet from "../../hooks/useRedeemSet";
import { getDisplayBalance } from '../../utils/formatBalance'

const ModelListItem = ({ data }) => {
  const [image, setBase64Image] = useState();

  useEffect(() => {
    (async () => {
      if (data.image) {
        fetch(data.image)
          .then((r) => r.text())
          .then((blob) => {
            setBase64Image(blob.replace(`"`, "").replace(/["']/g, ""));
          });
      }
    })();
  }, [data]);


  // const [setId, setSetId] = useState(null)
  // const [nftSetPrice, setNftSetPrice] = useState(new BigNumber('0'))

  // const 
  // useEffect(() => {
  //   setSetId(modelSetBundles[data.username])
  //   setNftSetPrice(useGetTreatSetCost(setId))
  // })


  const setId = modelSetBundles[data.username];
  const nftSetPrice = useGetTreatSetCost(setId);
  // console.log({nftSetPrice: nftSetPrice?.toString()})
  const { onRedeemSet } = setId
    ? useRedeemSet(setId, nftSetPrice)
    : { onRedeemSet: null };

  return (
    <div>
    <a href={`/model/${data.username}`}>
      <div className="model-list-item">
        <div className="creator">
          <div className="pic">
            <img src={data.profile_pic} className="profile-pic" />
          </div>
          <div className="details">
            <div className="label">CREATOR</div>
            <div className="name">{data.username}</div>
          </div>
        </div>
        <div className="button pt-4 pt-md-0 ">
          <Button variant="primary py-2 px-5 mr-3 w-sm-100">
            <b>VIEW MODEL</b>
          </Button>
          
          {!!onRedeemSet && (    <b>Set Bundle Price: {getDisplayBalance(nftSetPrice ?? '0')} BNB</b>)}
          {/* {!!onRedeemSet && (    <Button onClick={onRedeemSet}>Redeem full set for {getDisplayBalance(nftSetPrice ?? '0')}</Button>)} */}
        </div>
      </div>
    </a>
</div>
  );
};

export default ModelListItem;
