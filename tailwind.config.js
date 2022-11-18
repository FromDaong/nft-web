module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./packages/**/*.{js,ts,jsx,tsx}",
    "./core/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      primary: "#eb518a",
      primary2: "#e795b6",
      secondary: "#ecc94b",
      text: "#222222",
      colors: {
        text: "#222222",
      },
    },
  },
  plugins: [require("@tailwindcss/line-clamp")],
};
