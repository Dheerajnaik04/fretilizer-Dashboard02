/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class', // Enable dark mode based on 'class'
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'], // Custom font family for Inter
      },
    },
  },
  plugins: [],
}