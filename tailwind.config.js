/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          dark: "#14496c",
          light: "#737575",
          white: "#ffffff",
          contentDark: "#02121c33",
          contentLight: ""
        },
      },
    },
  },
  plugins: [],
};
