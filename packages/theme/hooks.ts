import { useState } from "react";

export function useTheme(default_theme = "light") {
  const [theme, setTheme] = useState(default_theme);

  const updateTheme = (theme: string) => {
    setTheme(theme);
  };

  return {
    theme,
    updateTheme,
  };
}
