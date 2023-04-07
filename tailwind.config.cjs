/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors:{
        superCoolEdgyPurple: "#9e75f0",
        deepPurple:"#17101a",
        shallowPurple:"31233a#",
        puddlePurple:"#433151",
        contrastingBlue:"#53caf5",
        fadedRed:"#c8464a",
      }
    },
  },
  plugins: [],
};

module.exports = config;

