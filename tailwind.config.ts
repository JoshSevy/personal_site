module.exports = {
  darkMode: 'class', // Enables dark mode via class toggle
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {},
  },
  plugins: [require('@tailwindcss/typography')],
};
