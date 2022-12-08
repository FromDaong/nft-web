import {Context} from "@contexts/TreatProvider";
import {useContext} from "react";

const useTreat = () => {
	const {treat} = useContext(Context);
	return treat;
};

export default useTreat;
