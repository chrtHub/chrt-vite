/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      animation: {
        text: "text 20s ease infinite",
      },
      keyframes: {
        text: {
          "0%, 100%": {
            "background-size": "200% 200%",
            "background-position": "right center",
          },
          "25%": {
            "background-size": "400% 500%",
            "background-position": "right center",
          },
          "50%": {
            "background-size": "600% 600%",
            "background-position": "left center",
          },
          "75%": {
            "background-size": "500% 400%",
            "background-position": "right center",
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography")],
};
