import {FpjsProvider} from "@fingerprintjs/fingerprintjs-pro-react";
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
			<FpjsProvider
				loadOptions={{
					apiKey: "5LG7UBlESl7pJPHsQjiI",
					region: "eu",
				}}
			>
				{children}
			</FpjsProvider>
		</ApplicationContext.Provider>
	);
};
