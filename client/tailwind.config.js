module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        poppins: ['var(--font-poppins)'],
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
