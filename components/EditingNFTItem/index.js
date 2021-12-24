import React, { useState, useEffect } from "react";
import { Button, InputGroup, FormControl, Form } from "react-bootstrap";
import CreatingNFTItemPreview from "../CreatingNFTItemPreview";
import { encode } from "blurhash";
import TagsSelector from "../TagsSelector";

const EditingNFTItem = ({ imageUrl, formik, modelData, blurRequired }) => {
  const [blurhash, setBlurHash] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);

  useEffect(() => {
    formik.setFieldValue(`tags`, selectedTags);
  }, [selectedTags]);

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
    context.drawImage(image, 0, 0, image.width / 4, image.height / 4);
    return context.getImageData(0, 0, image.width / 4, image.height / 4);
  };

  const encodeImageToBlurhash = async (imageUrl) => {
    const image = await loadImage(imageUrl);
    const imageData = getImageData(image);
    return encode(imageData.data, imageData.width, imageData.height, 9, 9);
  };

  const changeBlurhash = async (e) => {
    if (e.target.checked) {
      await formik.setFieldValue(`blurhash`, blurhash);
      if (blurhash) return;

      const returnedBlurhash = await encodeImageToBlurhash(imageUrl);
      setBlurHash(returnedBlurhash);
      formik.setFieldValue(`blurhash`, returnedBlurhash);
    } else {
      formik.setFieldValue(`blurhash`, false);
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
          name={formik.values.name}
          isOwner={true}
          modelData={modelData}
          // price={getDisplayBalance(new BigNumber(order.price))}
          price={formik.values.list_price}
          // owner={order.seller}
          quantity={1}
          disableAnimations={true}
        />
      </div>
      <div className="col-md-1" />
      <div className="col-md-7 d-flex justify-content-center flex-column">
        <div className="row pt-5 pt-md-0">
          <div className="pb-4 col-md-12">
            <label>NFT Name</label>
            <FormControl
              placeholder="E.g. Morning Wood"
              name={`name`}
              value={formik.values.name}
              // onChange={handleChange}
              onChange={(e) => {
                formik.setFieldValue(`name`, e.target.value);
              }}
            />
          </div>
          <div className="pb-4 col-md-12">
            <label>NFT List Price (in BNB)</label>
            <FormControl
              type="number"
              max={formik.values.list_price}
              min={0}
              step="any"
              placeholder="E.g. 120"
              name={`list_price`}
              value={formik.values.list_price}
              onChange={(e) =>
                formik.setFieldValue(
                  `list_price`,
                  +Number(e.target.value).toFixed(4)
                )
              }
            />
          </div>
        </div>
        <div className="pb-4">
          <label>NFT Description</label>
          <FormControl
            placeholder="E.g. Let's make you rise."
            as="textarea"
            name={`description`}
            value={formik.values.description}
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
                  id={`blurhash`}
                  name={`blurhash`}
                  checked={!!formik.values.blurhash}
                  onChange={changeBlurhash}
                />
              </div>
            )}
            <div className="col-md-10">
              {!formik.values.blurhash && !blurRequired ? (
                <></>
              ) : (
                <>
                  <FormControl
                    placeholder="E.g. eKO2?U%2Tw=wR6]~RBVZRip0};RPxuwH%3tLOtxZ%gixI.ENa0NZIV"
                    name={`blurhash`}
                    value={
                      formik.values.blurhash ||
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
          <label>Tags</label>
          <TagsSelector
            selectedTags={formik.values.tags || []}
            setSelectedTags={setSelectedTags}
          />
        </div>
        <Form.Control.Feedback type="invalid" className="d-block">
          {Object.keys(
            (formik.errors && formik.errors.nfts && formik.errors) || []
          ).map((e) => (
            <div>{formik.errors[e]}</div>
          ))}
          {formik.errors.code}
        </Form.Control.Feedback>
      </div>
    </div>
  );
};

export default EditingNFTItem;
