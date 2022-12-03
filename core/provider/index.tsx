import TreatState from "core/state";
import {createContext} from "react";

export default class TreatProvider {
	state: TreatState;
}

const ApplicationContext = createContext<{
	acceptedCookies: Array<"essential" | "analytics">;
}>({
	acceptedCookies: [],
});

export const ApplicationProvider = ({children}) => {
	return (
		<ApplicationContext.Provider value={{acceptedCookies: []}}>
			{children}
		</ApplicationContext.Provider>
	);
};
