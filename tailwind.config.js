/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: ["./src-website/**/*.{vue,js,ts,jsx,tsx,html}"],
  content: ["./src-website/**/*.{html,ts}"],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: ["acid"],
  },
  plugins: [require("daisyui")],
}
