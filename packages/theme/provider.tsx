import {darkTheme, lightTheme, ogPinkTheme, styled} from "@styles/theme";
import {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";
import {useTheme} from "./hooks";

const Div = styled("div", {
	height: "100%",
	width: "100%",
	backgroundColor: "$bodyBackground",
	color: "$text",
});

export const ApplicationTheme = createContext<{
	theme: string;
	themes?: Array<string>;
	updateTheme: (theme: string) => void;
}>({
	theme: "light",
	themes: ["dark", "light"],
	updateTheme: (_theme) => ({_theme}),
});

export const useApplicationTheme = () => {
	const {theme, updateTheme, themes} = useContext(ApplicationTheme);
	const [all_themes] = useState(themes);
	const indexNow = all_themes.indexOf(theme);
	const nextTheme =
		all_themes[indexNow < all_themes.length - 1 ? indexNow + 1 : 0];

	return {theme, updateTheme, themes, nextTheme};
};

export default function ThemeProvider({children}: {children: ReactNode}) {
	const {theme, updateTheme} = useTheme("light");

	const themes = {
		light: lightTheme,
		dark: darkTheme,
		pink: ogPinkTheme,
	};

	const currentTheme = useMemo(() => themes[theme], [theme]);

	useEffect(() => {
		if (typeof window !== "undefined") {
			try {
				const theme = localStorage.getItem("theme");
				updateTheme(theme as "dark" | "pink" | "light");
			} catch (err) {
				console.error("[x] Error reading theme from local");
			}
		}
	}, []);

	useEffect(() => {
		if (typeof window !== "undefined") {
			try {
				const htm = document.getElementsByTagName("html")[0];
				htm.className = currentTheme;
				localStorage.setItem("theme", currentTheme);
			} catch (err) {
				console.error("[x] Error reading theme from local");
			}
		}
	}, [theme]);

	return (
		<ApplicationTheme.Provider
			value={{theme, themes: ["dark", "light", "pink"], updateTheme}}
		>
			<Div>{children}</Div>
		</ApplicationTheme.Provider>
	);
}
