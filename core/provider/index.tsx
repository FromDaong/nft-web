import {FpjsProvider} from "@fingerprintjs/fingerprintjs-pro-react";
import TreatCore from "core/TreatCore";
import {createContext} from "react";
import {QueryClientProvider} from "@tanstack/react-query";

export default class TreatProvider {}

const ApplicationContext = createContext<{
	acceptedCookies: Array<"essential" | "analytics">;
}>({
	acceptedCookies: [],
});

export const ApplicationProvider = ({children}) => {
	return (
		<QueryClientProvider client={TreatCore.queryClient}>
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
		</QueryClientProvider>
	);
};
