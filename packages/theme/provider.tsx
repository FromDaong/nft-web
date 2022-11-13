import { darkTheme, lightTheme, ogPinkTheme } from "@styles/theme";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useTheme } from "./hooks";

const ApplicationTheme = createContext<{
  theme: string;
  themes?: Array<string>;
  updateTheme: (theme: string) => void;
}>({
  theme: "light",
  themes: ["dark", "light"],
  updateTheme: (_theme) => ({ _theme }),
});

export const useApplicationTheme = () => {
  const { theme, updateTheme, themes } = useContext(ApplicationTheme);
  const [all_themes] = useState(themes);
  const indexNow = all_themes.indexOf(theme);
  const nextTheme =
    all_themes[indexNow < all_themes.length - 1 ? indexNow + 1 : 0];

  return { theme, updateTheme, themes, nextTheme };
};

export default function ThemeProvider({ children }: { children: ReactNode }) {
  const { theme, updateTheme } = useTheme("light");

  const themes = {
    light: lightTheme,
    dark: darkTheme,
    pink: ogPinkTheme,
  };

  const currentTheme = useMemo(() => themes[theme], [theme]);

  useEffect(() => {
    const body = document.getElementsByTagName("body")[0];
    body.setAttribute("theme", theme);
  }, [theme]);

  return (
    <ApplicationTheme.Provider
      value={{ theme, themes: ["dark", "light", "pink"], updateTheme }}
    >
      <div className={currentTheme}>{children}</div>
    </ApplicationTheme.Provider>
  );
}
