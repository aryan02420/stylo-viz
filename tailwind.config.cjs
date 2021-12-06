const colors = require('tailwindcss/colors');

module.exports = {
  mode: 'jit',
  purge: {
    enabled: false,
    content: ['./src/**/*.svelte'],
    safelist: [
      'median',
      'iqr'
    ]
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      inherit: 'inherit',
      ...colors,
    },
    extend: {
      screens: {
        print: { raw: 'print' },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
