/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      minWidth: {
        300: "300px",
        200: "200px",
      },
      textDecoration: ["group-hover"],
    },
    screens: {
      sm: { max: "740px" },
    },
    flex: {
      2: "2 2 0%",
      6: "6 6 0%",
    },
    listStyleType: {
      bullet: "bullet points",
      square: "square",
    },
  },
  plugins: [],
});
