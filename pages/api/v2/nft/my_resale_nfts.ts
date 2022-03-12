import { web3Node, ethers } from "../../../../utils/moralis";
import dbConnect from "../../../../utils/dbConnect";
import { withJWTAuth } from "../../../../utils/server-utils";
import NFT from "../../../../models/NFT";
import TreatMarketplaceAbi from "../../../../treat/lib/abi/treatMarketplace.json";
import Web3 from "web3";

const web3 = new Web3(
  "https://divine-restless-feather.bsc.quiknode.pro/f9ead03ddd05508e4fe1f6952eea26ac035c8408/"
);

dbConnect();

const myNFTs = async (req, res) => {
  const { session } = req;
  const { ethAddress } = session;
  let body = null;
  let signature = null;
  if (req.method === "POST") {
    body = req.body;
    signature = body.signature;

    if (signature) {
      try {
        const signer = web3.eth.accounts.recover("Reveal Contents", signature);
        const address = session.ethAddress.toUpperCase();
        if (signer.toUpperCase() !== address) {
          return res.status(403).json({
            error: "Invalid signature",
          });
        }
      } catch (err) {
        console.log({ err });
        return res.status(403).json({
          error: "Invalid signature",
        });
      }
    }
  }
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
  console.log({ open_order_ids });
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

      if (returnObj.blurhash && !signature) {
        delete returnObj.image;
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
