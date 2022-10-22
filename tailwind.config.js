const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: ['./pages/**/*.{vue,js}', './layouts/**/*.{vue,js}', './components/**/*.{vue,js}', './plugins/**/*.{js,ts}'],
  theme: {
    extend: {
      fontFamily: {
        title: ['Inter', ...defaultTheme.fontFamily.sans],
        text: ['Inter', ...defaultTheme.fontFamily.sans],
      },
    },
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '2rem',
        lg: '4rem',
        xl: '5rem',
        '2xl': '6rem',
      },
    },
    screens: {
      sm: '768px',
      md: '1024px',
      lg: '1440px',
      xl: '1920px',
    },
  },
  plugins: [],
}
