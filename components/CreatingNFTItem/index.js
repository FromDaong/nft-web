import React, { useState, useEffect } from "react";
import { Button, InputGroup, FormControl, Form } from "react-bootstrap";
import CreatingNFTItemPreview from "../CreatingNFTItemPreview";
import { encode } from "blurhash";
import { set } from "react-ga";

let easing = [0.175, 0.85, 0.42, 0.96];

const variants = {
  initial: {
    y: 150,
    opacity: 0,
  },
  hidden: {
    opacity: 0,
    y: 150,
    transition: {
      duration: 0.1,
      ease: easing,
    },
  },
  show: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: easing,
    },
  },
};

const CreatingNFTItem = ({
  imageUrl,
  formik,
  handleChange,
  index,
  modelData,
  blurRequired,
}) => {
  const [blurhash, setBlurHash] = useState("");

  const loadImage = async (src) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = (...args) => reject(args);
      img.src = src;
      img.setAttribute("crossOrigin", "");
    });

  const getImageData = (image) => {
    const canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    const context = canvas.getContext("2d");
    context.drawImage(image, 0, 0);
    return context.getImageData(0, 0, image.width, image.height);
  };

  const encodeImageToBlurhash = async (imageUrl) => {
    const image = await loadImage(imageUrl);
    const imageData = getImageData(image);
    return encode(imageData.data, imageData.width, imageData.height, 4, 4);
  };

  const changeBlurhash = async (e) => {
    if (e.target.checked) {
      await formik.setFieldValue(`nfts[${index}].blurhash`, blurhash);
      if (blurhash) return;

      const returnedBlurhash = await encodeImageToBlurhash(imageUrl);
      setBlurHash(returnedBlurhash);
      formik.setFieldValue(`nfts[${index}].blurhash`, returnedBlurhash);
    } else {
      formik.setFieldValue(`nfts[${index}].blurhash`, false);
    }
  };

  useEffect(() => {
    (async () => {
      if (blurRequired) changeBlurhash({ target: { checked: true } });
    })();
  }, [imageUrl]);

  return (
    <div className="white-tp-container py-4 px-4 mt-2 row">
      <div className="col-md-4">
        <CreatingNFTItemPreview
          imageUrl={imageUrl}
          name={formik.values.nfts[index].name}
          isOwner={true}
          modelData={modelData}
          // price={getDisplayBalance(new BigNumber(order.price))}
          price={formik.values.nfts[index].list_price}
          // owner={order.seller}
          quantity={1}
          disableAnimations={true}
        />
      </div>
      <div className="col-md-1" />
      <div className="col-md-7 d-flex justify-content-center flex-column">
        <div className="row pt-5 pt-md-0">
          <div className="pb-4 col-md-6">
            <label>NFT Name</label>
            <FormControl
              placeholder="E.g. Morning Wood"
              name={`nfts[${index}].name`}
              value={formik.values.nfts[index].name}
              // onChange={handleChange}
              onChange={(e) => {
                console.log({ e: e.target.value });
                formik.setFieldValue(`nfts[${index}].name`, e.target.value);
              }}
            />
          </div>
          <div className="pb-4 col-md-6">
            <label>NFT List Price (in BNB)</label>
            <FormControl
              type="number"
              placeholder="E.g. 120"
              name={`nfts[${index}].list_price`}
              value={formik.values.nfts[index].list_price}
              onChange={formik.handleChange}
            />
          </div>
        </div>
        <div className="pb-4">
          <label>NFT Description</label>
          <FormControl
            placeholder="E.g. Let's make you rise."
            as="textarea"
            name={`nfts[${index}].description`}
            value={formik.values.nfts[index].description}
            onChange={formik.handleChange}
          />
        </div>
        <div className="pb-4">
          <label className="w-100">
            {blurRequired
              ? "Generated Blurhash for Resale Marketplace:"
              : 'Blur this NFT publicly so users must "Pay to Reveal" the content?'}
          </label>
          <div className="row">
            {!blurRequired && (
              <div className="col-md-2 text-center pt-2">
                <Form.Check
                  className="d-inline mt-2"
                  type="switch"
                  id={`nfts[${index}].blurhash`}
                  name={`nfts[${index}].blurhash`}
                  checked={!!formik.values.nfts[index].blurhash}
                  onChange={changeBlurhash}
                />
              </div>
            )}
            <div className="col-md-10">
              {!formik.values.nfts[index].blurhash && !blurRequired ? (
                <></>
              ) : (
                <>
                  <FormControl
                    placeholder="E.g. eKO2?U%2Tw=wR6]~RBVZRip0};RPxuwH%3tLOtxZ%gixI.ENa0NZIV"
                    name={`nfts[${index}].blurhash`}
                    value={
                      formik.values.nfts[index].blurhash ||
                      "Loading Blurhash, Please wait a minute..."
                    }
                    onChange={formik.handleChange}
                  />
                  <small>(Auto-generated Blurhash for this image)</small>
                </>
              )}
            </div>
          </div>{" "}
        </div>
        <div className="pb-4">
          <label>Maximum Supply</label>
          <FormControl
            type="number"
            placeholder="E.g. 1500"
            name={`nfts[${index}].max_supply`}
            value={formik.values.nfts[index].max_supply}
            onChange={formik.handleChange}
          />
        </div>
        <Form.Control.Feedback type="invalid" className="d-block">
          {Object.keys(
            (formik.errors &&
              formik.errors.nfts &&
              formik.errors.nfts[index]) ||
              []
          ).map((e) => (
            <div>{formik.errors.nfts[index][e]}</div>
          ))}
          {formik.errors.code}
        </Form.Control.Feedback>
      </div>
    </div>
  );
};

export default CreatingNFTItem;
