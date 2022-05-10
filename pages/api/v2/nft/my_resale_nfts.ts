import { ethers, web3Node } from "../../../../utils/moralis";

import NFT from "../../../../db/models/NFT";
import TreatMarketplaceAbi from "../../../../treat/lib/abi/treatMarketplace.json";
import dbConnect from "../../../../utils/dbConnect";
import { withJWTAuth } from "../../../../utils/server-utils";

dbConnect();

const myNFTs = async (req, res) => {
  const { session } = req;
  const { ethAddress } = session;

  const options = {
    page: req.query.page ?? 1,
    limit: 12,
    collation: {
      locale: "en",
    },
    sort: {},
  };

  const marketplace_contract = new ethers.Contract(
    process.env.TREAT_MARKETPLACE_ADDRESS,
    TreatMarketplaceAbi,
    web3Node
  );

  const open_orders =
    (await marketplace_contract.getOpenOrdersForSeller(ethAddress)) ?? [];
  const open_order_ids = open_orders.map((order) => order.toNumber());
  // @ts-ignore
  const open_orders_metadata = await NFT.paginate(
    {
      id: { $in: open_order_ids },
    },
    options
  );

  open_orders_metadata.docs = await Promise.all(
    open_orders_metadata.docs.map(async (data) => {
      const order_data = await marketplace_contract.orderBook(
        Number(data.id),
        ethAddress
      );

      const returnObj = {
        price: order_data.price.toString(),
        seller: order_data.seller.toString(),
        listDate: order_data.listDate.toString(),
        expiresDate: order_data.expiresDate.toString(),
        closedDate: order_data.closedDate.toString(),
        quantity: order_data.quantity.toString(),
        ...data.toObject(),
      };

      if (returnObj.cdnUrl) {
        returnObj.image = returnObj.cdnUrl;
        delete returnObj.cdnUrl;
      }

      // Removing this to minimize total payload, get only what we need.
      delete returnObj.description;
      delete returnObj.mints;

      return returnObj;
    })
  );

  open_orders_metadata.docs = open_orders_metadata.docs.filter((e) => e);
  return res.json(open_orders_metadata);
};

export default withJWTAuth(myNFTs);
