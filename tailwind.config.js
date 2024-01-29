/** @type {import('tailwindcss').Config} */
export default {
  purge: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  // content: ["./**/*.{html,js}"],
  content: ["./public/index.html", "./src/**/*.{html,js}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
