import { useContext } from "react";
import { Context } from "../../../contexts/TreatProvider";

const useTreat = () => {
  const { treat } = useContext(Context);
  return treat;
};

export default useTreat;
