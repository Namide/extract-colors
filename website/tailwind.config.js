/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  safelist: [{
    pattern: /hljs+/,
  }],
  theme: {
    hljs: {
      theme: 'monokai',
    },
  },
  daisyui: {
    themes: ["acid"],
  },
  plugins: [require("daisyui"), require('tailwind-highlightjs')],
}
