import { useEffect, useState } from "react";
import {
  getTreatMarketplaceContract,
  getTreatMarketReaderContract,
  getResaleOrder,
  getOpenOrdersForNft,
  getOrdersInfoForNftRange,
} from "../packages/treat/utils";
import useTreat from "./useTreat";

const useGetAllOpenOrders = (maxId: number) => {
  const [orderBook, setOrderBook] = useState(null);

  const treat = useTreat();
  const treatMarketplaceContract = getTreatMarketplaceContract(treat);
  const treatMarketReaderContract = getTreatMarketReaderContract(treat);

  useEffect(() => {
    async function fetchAllOrders() {
      const sales = [];
      const rangeArray = [];

      for (let i = 1; i <= Number(maxId); i++) {
        if (i % 5 === 0) {
          rangeArray.push({
            min: i - 5,
            max: i,
          });
        } else if (i === Number(maxId)) {
          rangeArray.push({
            min: rangeArray[rangeArray.length - 1].max,
            max: i,
          });
        }
      }

      const orders = await Promise.all(
        rangeArray.map((a) => {
          return new Promise(async (resolve, reject) => {
            const order = await getOrdersInfoForNftRange(
              treatMarketReaderContract,
              a.min,
              a.max
            );
            resolve(order);
          });
        })
      );

      const singleArray = [].concat(...orders);

      const ids = singleArray.map((o) => o.nftId);
      const filtered = singleArray.filter(
        ({ id }, index) => !ids.includes(id, index + 1)
      );

      setOrderBook(filtered);
    }

    fetchAllOrders();
  }, [treat, maxId]);

  return [orderBook, setOrderBook];
};

export default useGetAllOpenOrders;
