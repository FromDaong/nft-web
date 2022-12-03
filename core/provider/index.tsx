import {FpjsProvider} from "@fingerprintjs/fingerprintjs-pro-react";
import {ApplicationTheme} from "@packages/theme";
import TreatState from "core/state";
import {createContext, useContext, useEffect} from "react";

export default class TreatProvider {
	state: TreatState;
}

const ApplicationContext = createContext<{
	acceptedCookies: Array<"essential" | "analytics">;
}>({
	acceptedCookies: [],
});

export const ApplicationProvider = ({children}) => {
	const theme = useContext(ApplicationTheme);

	useEffect(() => {
		if (theme.theme === "undefined") {
			theme.updateTheme("light");
		}
	}, [theme.theme]);

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
