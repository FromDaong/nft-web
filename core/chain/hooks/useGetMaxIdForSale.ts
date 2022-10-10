import { useEffect, useState } from "react";
import {
  getTreatMarketplaceContract,
  getMaxIdForSale,
} from "../../../packages/treat/utils";
import useTreat from "./useTreat";

const useGetMaxIdForSale = () => {
  const [id, setId] = useState(0);
  const treat = useTreat();

  const treatMarketplaceContract = getTreatMarketplaceContract(treat);

  useEffect(() => {
    async function fetchMaxId() {
      const _id = await getMaxIdForSale(treatMarketplaceContract);
      setId(_id);
    }

    if (treat) {
      fetchMaxId();
    }
  }, [treat]);

  return id;
};

export default useGetMaxIdForSale;
