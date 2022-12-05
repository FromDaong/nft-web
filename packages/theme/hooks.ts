import {useState} from "react";

export function useTheme(default_theme: "light" | "pink" | "dark" = "light") {
	const [theme, setTheme] = useState<"light" | "pink" | "dark">(default_theme);

	const updateTheme = (theme: "light" | "pink" | "dark") => {
		setTheme(theme);
	};

	return {
		theme,
		updateTheme,
	};
}

export const useUpdateTheme = () => {
	const theme = useTheme("light");
	return {theme: theme.theme, updateTheme: theme.updateTheme};
};
