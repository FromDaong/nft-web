export const mapMintBody = (mint) => {
  return {
    transactionHash: mint?.transactionHash,
    nftId: mint?.nftId,
    price: mint?.price.toString(),
    buyer: mint?.buyer,
    timestamp: mint?.timestamp,
  };
};

export const mapNftBody = (nftBodyJson) => {
  return {
    id: req.body.id,
    list_price: req.body.list_price,
    name: req.body.name,
    description: req.body.description,
    external_url: req.body.external_url,
    image: req.body.image,
    model_handle: req.body.model_handle,
    max_supply: req.body.max_supply,
    model_bnb_address: req.body.model_bnb_address,
    blurhash: req.body.blurhash,
    model_profile_pic: req.body.model_profile_pic_url,
    attributes: [
      {
        trait_type: "Model",
        value: req.body.model_handle,
      },
      {
        trait_type: "Max Supply",
        value: req.body.max_supply,
      },
    ],
    mints: nftBodyJson.mints.map((m) => mapMintBody(m)),
  };
};
