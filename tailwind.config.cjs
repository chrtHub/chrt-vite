/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      animation: {
        fadeout: "fadeout 20s",
      },
      keyframes: {
        fadeout: {
          "0%": { opacity: "1" },
          "5%": { opacity: "0" },
          "100%": { opacity: "0" },
        },
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    require("@headlessui/tailwindcss"),
  ],
};
