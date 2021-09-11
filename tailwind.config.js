const colors = require('./src/styles/colors')

module.exports = {
  //   purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./src/components/**/*.{js,ts,jsx,tsx}"],
  darkMode: false,
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      ...colors,
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
